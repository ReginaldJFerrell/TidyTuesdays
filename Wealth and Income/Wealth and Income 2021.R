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

#Import
tuesdata <- tidytuesdayR::tt_load('2021-02-09')
tuesdata <- tidytuesdayR::tt_load(2021, week = 7)

lifetime_earn <- tuesdata$lifetime_earn

#Import data from tidy tuesdays repo
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

#############
# Debt over time
###########
#Playing around with the area plots for the time series data
plot_01 <- student_debt %>% group_by(year) %>% 
  summarise(avg_debt = sum(loan_debt)) %>% 
  ggplot(aes(x=year, y=avg_debt),fill = "black") + 
  geom_area(size=.5, colour="black") +
  theme_minimal()+
  labs(title="US Student Debt", 
       subtitle="Change over time by Race", 
       x="Year",
       y="Average Debt") +  
  scale_y_continuous(limits=c(0, 35000), breaks=seq(0,35000,5000)) +
  scale_x_continuous(limits=c(1986, 2020)) +
  theme(plot.title = element_text(face="bold",hjust = 0.5),
        plot.subtitle = element_text(hjust = 0.5 ))
plot_01


plot_02 <- student_debt %>% group_by(year,race) %>% 
  summarise(avg_debt = sum(loan_debt)) %>% 
  ggplot(aes(x=year, y=avg_debt,fill = race)) + 
  geom_area(size=.5, colour="black") +
  theme_minimal() +
  labs(title="Monthly Time Series", 
       subtitle="Returns Percentage from Economics Dataset", 
       caption="Source: Economics", 
       y="Returns %") +  # title and caption
  scale_x_date(labels = lbls, 
               breaks = brks) +  # change to monthly ticks and labels
  theme(axis.text.x = element_text(angle = 90, vjust=0.5),  # rotate x axis text
        panel.grid.minor = element_blank())
scale_fill_manual(values = c("psavert"="#00ba38", "uempmed"="#f8766d")) +  # line color
  theme(panel.grid.minor = element_blank())  # turn off minor grid


# Plot
ggplot(data, aes(x=time, y=percentage, fill=group)) + 
  geom_area(alpha=0.6 , size=1, colour="black")

ggplot(time_studentdebt, aes(x=year)) + 
  geom_line(aes(y=avg_debt)) + 
  labs(title="Monthly Time Series", 
       subtitle="Returns Percentage from Economics Dataset", 
       caption="Source: Economics", 
       y="Returns %") +  # title and caption
  scale_x_date(labels = lbls, 
               breaks = brks) +  # change to monthly ticks and labels
  theme(axis.text.x = element_text(angle = 90, vjust=0.5),  # rotate x axis text
        panel.grid.minor = element_blank())


family_wealth <- race_wealth %>% filter(year=="2016") 
black_family <- family_wealth %>% filter(race=="Black") 
white_family <- family_wealth %>% filter(race=="White") 
hispanic_family <- family_wealth %>% filter(race=="Hispanic") 


gender <- lifetime_earn %>% group_by(gender) %>% mutate(total_by_gender = sum(lifetime_earn)) %>% 
  mutate(pct_by_gender = (lifetime_earn/total_by_gender) * 100) %>%
         pct_by_gender = (total_earnings/total_by_gender) * 100) %>%
  mutate(sum = sum(women_earnings + men_earnings))
   






