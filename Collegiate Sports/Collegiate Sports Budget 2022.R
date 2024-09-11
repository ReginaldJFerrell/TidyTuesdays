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

### Questions
#Q1. Which schools have the greatest expenditure/revenue?
#Q2. B1G- Conference exp./rev. over time 
#Q3. State of Michigan Institutions - Participation, Exp, Rev
# Where is the greatest net profit
# Big Ten Expenditures/Revenues over time (by sport)
# Where are the universities located (Map/Rshiny map)

#
institutions_2019 <- sports %>% filter(year==2019) %>% 
  group_by(year,institution_name,city_txt,state_cd,classification_name) %>% 
  summarise(rev_women = sum(rev_women,na.rm = TRUE),
            rev_men = sum(rev_men,na.rm = TRUE),
            total_rev_menwomen = sum(total_rev_menwomen,na.rm = TRUE),
            exp_women = sum(exp_women,na.rm = TRUE),
            exp_men = sum(exp_men,na.rm = TRUE),
            total_exp_menwomen = sum(total_exp_menwomen,na.rm = TRUE),
            net_profit=(total_rev_menwomen-total_exp_menwomen)) %>% 
  mutate(percentile99_net = ifelse(net_profit > 18827786,"Top 1%","Others"),
         percentile1_net = ifelse(net_profit < -3463736,"Bottom 1%","Others"),
         percentile99_exp = ifelse(total_exp_menwomen > 80117615.52,"Top 1%","Others"),
         percentile1_exp = ifelse(total_exp_menwomen < 54786.92,"Bottom 1%","Others"),
         percentile99_rev = ifelse(total_rev_menwomen > 95988429.3,"Top 1%","Others"),
         percentile1_rev = ifelse(total_rev_menwomen < 47075.8 ,"Bottom 1%","Others"))


top1_net <- institutions_2019 %>% filter(percentile99_net == "Top 1%",
                                         net_profit > 0) 
bottom1_net <- institutions_2019 %>% filter(percentile1_net == "Bottom 1%")

net=institutions_2019$net_profit
  quantile(net,c(.01,.50,.99))
revenue=institutions$total_rev_menwomen
  quantile(revenue,c(.01,.50,.99))
expenditure=institutions$total_exp_menwomen
  quantile(expenditure,c(.01,.50,.99))


#Big Ten
big10_2019 <- c("University of Illinois at Urbana-Champaign", "Indiana University-Bloomington", 
                "University of Iowa", "University of Maryland-College Park", 
                "University of Michigan-Ann Arbor", "Michigan State University", 
                "University of Minnesota-Twin Cities", "University of Nebraska-Lincoln", 
                "Northwestern University", "Ohio State University-Main Campus", 
                "Pennsylvania State University-Main Campus", "Purdue University-Main Campus", 
                "Rutgers University-New Brunswick", "University of Wisconsin-Madison")
  

#Create vector to loop over rev and exp data
uni_type <- unique(sports$classification_name)
uni_year <- unique(sports$year)



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

#Register API
# sports_geo <- sports %>% 
#   tidygeocoder::geocode(institution_name)

#Export to Excel 
# write.xlsx(sports_geo, file = 'Universities - Geocoded.xlsx')
geo <- read_excel("C:/Users/rferrell/TidyTuesdays/collegiate_sports/Universities - Geocoded.xlsx") %>% 
  dplyr::select(institution_name, lat,long )
  
rev_geo <- rev %>% left_join(geo,by="institution_name") %>% unique()
exp_geo <- exp %>% left_join(geo,by="institution_name") %>% unique()


