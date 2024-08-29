# Get the Data
#Load packages
packages <- c("haven", "ggplot2", "gapminder", "tidyverse", "dplyr", "stringr", 
              "tidyr", "devtools", "RODBC", "RColorBrewer", "foreign", "knitr", "markdown", 
              "rmarkdown", "tinytex", "kableExtra", "stargazer", "xtable", "readxl", "tidyr", "reshape2",
              "lubridate", "viridis", "haven", "janitor", "wesanderson", "cowplot", "forcats", "ggrepel", 
              "hrbrthemes", "ggalt", "scales", "psych", "corrplot", "gtools", "gapminder", "sf",
              "tigris", "censusapi","tmap", "tidycensus", "mapview","ggmap","lattice","leafpop",
              "maps","spData","magick","readxl","writexl","vroom","WriteXLS","openxlsx","fuzzyjoin",
              "tidytuesdayR")
# invisible(lapply(packages, install.packages, character.only = TRUE))
invisible(lapply(packages, library, character.only = TRUE))
# Read in with tidytuesdayR package 
# Install from CRAN via: install.packages("tidytuesdayR")
# This loads the readme and all the datasets for the week of interest

# Either ISO-8601 date or year/week works!

tuesdata <- tidytuesdayR::tt_load('2021-02-09')
tuesdata <- tidytuesdayR::tt_load(2021, week = 7)

lifetime_earn <- tuesdata$lifetime_earn

# Or read in the data manually

lifetime_earn <- readr::read_csv('https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2021/2021-02-09/lifetime_earn.csv')
student_debt <- readr::read_csv('https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2021/2021-02-09/student_debt.csv')
retirement <- readr::read_csv('https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2021/2021-02-09/retirement.csv')
home_owner <- readr::read_csv('https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2021/2021-02-09/home_owner.csv')
race_wealth <- readr::read_csv('https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2021/2021-02-09/race_wealth.csv')
income_time <- readr::read_csv('https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2021/2021-02-09/income_time.csv')
income_limits <- readr::read_csv('https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2021/2021-02-09/income_limits.csv')
income_aggregate <- readr::read_csv('https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2021/2021-02-09/income_aggregate.csv')
income_distribution <- readr::read_csv('https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2021/2021-02-09/income_distribution.csv')
income_mean <- readr::read_csv('https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2021/2021-02-09/income_mean.csv')



time_studentdebt <- student_debt %>% group_by(year) %>% summarise(avg_debt = sum(loan_debt)) 
race_studentdebt <- student_debt %>% group_by(year,race) %>% summarise(avg_debt = sum(loan_debt)) 

family_wealth <- race_wealth %>% filter(year=="2016") 
black_family <- family_wealth %>% filter(race=="Black") 
white_family <- family_wealth %>% filter(race=="White") 
hispanic_family <- family_wealth %>% filter(race=="Hispanic") 


gender <- lifetime_earn %>% group_by(gender) %>% mutate(total_by_gender = sum(lifetime_earn)) %>% 
  mutate(pct_by_gender = (lifetime_earn/total_by_gender) * 100) %>%
  
  # mutate(women_earnings = ifelse(gender=="Women",max(total_by_gender),0),
  #         men_earnings = ifelse(gender=="Men",max(total_by_gender),0),
  #       total_earnings = sum(total_by_gender),
         pct_by_gender = (total_earnings/total_by_gender) * 100) %>%
  mutate(sum = sum(women_earnings + men_earnings))
   



