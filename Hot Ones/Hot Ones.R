# Get the Data
#Load packages
packages <- c("haven", "ggplot2", "gapminder", "tidyverse", "dplyr", "stringr", "readxl", "tidyr", "reshape2",
              "lubridate", "viridis", "haven", "janitor", "wesanderson", "cowplot", "forcats", "ggrepel", 
              "hrbrthemes","sf","tigris", "censusapi","tmap", "tidycensus", "mapview","ggmap",
              "readxl","writexl","vroom","WriteXLS","openxlsx","fuzzyjoin","tidygeocoder","lubridate",
              "tidytuesdayR")
# invisible(lapply(packages, install.packages, character.only = TRUE))
invisible(lapply(packages, library, character.only = TRUE))

# Get the Data
# Get the Data
# Option 1: tidytuesdayR package 
## install.packages("tidytuesdayR")

tuesdata <- tidytuesdayR::tt_load('2023-08-08')
## OR
tuesdata <- tidytuesdayR::tt_load(2023, week = 32)

episodes <- tuesdata$episodes
sauces <- tuesdata$sauces
seasons <- tuesdata$seasons

# Option 2: Read directly from GitHub

episodes <- readr::read_csv('https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2023/2023-08-08/episodes.csv')
sauces <- readr::read_csv('https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2023/2023-08-08/sauces.csv')
seasons <- readr::read_csv('https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2023/2023-08-08/seasons.csv')

group1 <- c(1,2,3,4,5)
group2 <- c(6,7,8,9,10)
group3 <- c(11,12,13,14,15)
group4 <- c(16,17,18,19,20)

seasons_clean <- episodes %>% 
  mutate(original_release_month=format(original_release,"%m"),
         seasons_grouped = ifelse(season %in% group1,"Seasons 1-5",""),
         seasons_grouped = ifelse(season %in% group2,"Seasons 6-10",seasons_grouped),
         seasons_grouped = ifelse(season %in% group3,"Seasons 11-15",seasons_grouped),
         seasons_grouped = ifelse(season %in% group4,"Seasons 16-20",seasons_grouped),
         seasons_grouped = ifelse(season==21,"Season 21",seasons_grouped))

finishers <- seasons_clean %>% mutate(all_contestants=1) %>%
  mutate(finishers = ifelse(finished=="TRUE",1,0)) %>%
  group_by(seasons_grouped) %>% mutate(total_contestants = sum(all_contestants)) %>% group_by(seasons_grouped,finishers)%>%
  mutate(finisher_count = sum(finishers)) 

seasons_finishers <- seasons_clean %>% group_by(season) %>%
  mutate(all_contestants=1,
        total_contestants=sum(all_contestants)) %>%
  mutate(finishers = ifelse(finished=="TRUE",1,0)) %>%
  group_by(season) %>% mutate(finisher_count = sum(finishers)) %>% 
  select(season,finisher_count, total_contestants) %>%
  unique() %>%
  # group_by(season) %>%
  mutate(pct_finish = sum(finisher_count/total_contestants)) 
  
  