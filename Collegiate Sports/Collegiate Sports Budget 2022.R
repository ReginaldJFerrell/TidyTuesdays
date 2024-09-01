# Get the Data
#Load packages
packages <- c("haven", "ggplot2", "gapminder", "tidyverse", "dplyr", "stringr", "readxl", "tidyr", "reshape2",
              "lubridate", "viridis", "haven", "janitor", "wesanderson", "cowplot", "forcats", "ggrepel", 
              "hrbrthemes","sf","tigris", "censusapi","tmap", "tidycensus", "mapview","ggmap",
              "readxl","writexl","vroom","WriteXLS","openxlsx","fuzzyjoin","tidygeocoder",
              "tidytuesdayR")
# invisible(lapply(packages, install.packages, character.only = TRUE))
invisible(lapply(packages, library, character.only = TRUE))

# Get the Data 

# Read in with tidytuesdayR package 
# Install from CRAN via: install.packages("tidytuesdayR")
# This loads the readme and all the datasets for the week of interest

# Either ISO-8601 date or year/week works!

tuesdata <- tidytuesdayR::tt_load('2022-03-29')
tuesdata <- tidytuesdayR::tt_load(2022, week = 13)

sports <- tuesdata$sports
sports <- readr::read_csv('https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2022/2022-03-29/sports.csv') 

##################
# Summarise Data 
##################

#Total Revenue
rev <- sports %>% 
  group_by(year,institution_name,city_txt,state_cd,classification_name) %>%
  summarise(rev_women = sum(rev_women,na.rm = TRUE),
            rev_men = sum(rev_men,na.rm = TRUE),
            total_rev_menwomen = sum(total_rev_menwomen,na.rm = TRUE)) %>% ungroup()
#Total Expenditure
exp <- sports %>% 
  group_by(year,institution_name,city_txt,state_cd,classification_name) %>%
  summarise(exp_women = sum(exp_women,na.rm = TRUE),
            exp_men = sum(exp_men,na.rm = TRUE),
            total_exp_menwomen = sum(total_exp_menwomen,na.rm = TRUE))

#Avg. revenue 
avg_rev <- sports %>% group_by(year,classification_name,sports) %>%
  summarise(rev_women = mean(rev_women,na.rm = TRUE),
            rev_men = mean(rev_men,na.rm = TRUE),
            total_rev_menwomen = mean(total_rev_menwomen,na.rm = TRUE)) %>%
  ungroup() %>% unique()

#Avg. expenditure 
avg_exp<- sports %>%  group_by(year,classification_name,sports) %>%
  summarise(exp_women = sum(exp_women,na.rm = TRUE),
            exp_men = sum(exp_men,na.rm = TRUE),
            total_exp_menwomen = sum(total_exp_menwomen,na.rm = TRUE))%>%
  ungroup() %>% unique()

#Create vector to loop over rev and exp data
uni_type <- unique(sports$classification_name)
uni_year <- unique(sports$year)

######## Classification Updates
classification_2019 <- sports %>%
  filter(year == 2019) %>%
  select(institution_name, classification_name, classification_code) %>%
  rename(classification_new = classification_name,
         classification_code_2019 = classification_code)

transitions <- sports %>%
  select(year, institution_name, classification_name, classification_code) %>%
  left_join(classification_2019, by = "institution_name") %>%
  group_by(institution_name) %>%
  mutate(new_model = ifelse(year == 2015, classification_name != classification_new, FALSE)) %>% 
  unique() %>% 
  rename(classification_2015 = classification_name,
         classification_2019 = classification_new) %>% select(-(year)) %>% 
  mutate(count= ifelse(new_model==TRUE,1,0),
         count = ifelse(is.na(count),0,count),
         classification_2019= ifelse(is.na(classification_2019),"No Data",classification_2019)) %>%
  ungroup() %>% group_by(classification_2015,classification_code,
                         classification_2019,classification_code_2019) %>%
  summarise(count =sum(count)) %>% ungroup() %>%
  dplyr::select(classification_2015,classification_2019,count) %>%
  unique() %>% 
  filter(classification_2015 =="Other") #Removing Other as original 

#Register API - Removing for GitHub
# sports_geo <- sports %>% 
#   tidygeocoder::geocode(institution_name)

#Export to Excel 
# write.xlsx(sports_geo, file = 'Universities - Geocoded.xlsx')
geo <- read_excel("C:/Users/rferrell/Documents/New folder/Universities - Geocoded.xlsx") %>% 
  dplyr::select(institution_name, lat,long )
  
rev_geo <- rev %>% left_join(geo,by="institution_name") %>% unique()
exp_geo <- exp %>% left_join(geo,by="institution_name") %>% unique()

##################
# Plot
##################
