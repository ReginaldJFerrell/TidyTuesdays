# Get the Data
#Load packages
packages <- c("haven", "ggplot2", "gapminder", "tidyverse", "dplyr", "stringr", 
              "tidyr", "devtools", "RODBC", "RColorBrewer", "readxl", "reshape2",
              "lubridate", "viridis", "haven", "janitor", "wesanderson", "cowplot", "forcats", "ggrepel", 
              "hrbrthemes", "ggalt", "scales", "corrplot", "sf",
              "tigris", "censusapi","tmap", "tidycensus", "mapview","ggmap","lattice","leafpop",
              "maps","spData","magick","readxl","writexl","vroom","WriteXLS","openxlsx","fuzzyjoin",
              "tidytuesdayR")
# invisible(lapply(packages, install.packages, character.only = TRUE))
invisible(lapply(packages, library, character.only = TRUE))
dir <- "/Users/reginaldferrell/TidyTuesdays/Ramen"

ramen_ratings <- readr::read_csv("https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2019/2019-06-04/ramen_ratings.csv")%>% 
  na.omit(stars)


############### Key Questions: 
# 1. Where are highest ratings for Ramen? (country)
# 2. Which Ramen is the most popular? (style/brand) -- just style
#################

#Number of ratings per country -- (limit by Median)

#Ranking by country - Best 
ranking_country <- ramen_ratings %>% mutate(response_count=1) %>% 
  group_by(country) %>% 
  summarise(avg_rating = mean(stars),
          response_count = sum(response_count),
          max = max(stars),
          min = min(stars),
          sd = sd(stars),
          se = sd/sqrt(response_count),
          ci = se*1.96) %>% ungroup %>% 
#keeping values at the median to limit the data a bit
  mutate(median = median(response_count)) %>% filter(response_count >= median) #Just keeping large response counts
         #rating_category = ifelse(response_count >= median,"Large Respondent Pool","Low Respondent Pool")) #Respondent 
universe <- unique(ranking_country$country)

#Ranking style (filtered to high respondent countries)
ranking_style <- ramen_ratings %>% filter(country %in% universe) %>% 
  group_by(style) %>% 
  summarise(avg_rating = mean(stars)) %>% 
  mutate(avg_rating=round(avg_rating,2))

#####
#Plot 1 
#####
plot_01 <- ranking_country %>% 
  ggplot(aes(x = fct_reorder(country, avg_rating), y = avg_rating)) +
  theme_minimal()+
  geom_hline(aes(yintercept = mean(ramen_ratings$stars, na.rm = TRUE)), 
             linetype = "dashed") +
  geom_errorbar(aes(ymin = avg_rating - ci, ymax = avg_rating + ci, color = response_count), 
                width = .2, size = .75) +
  geom_point(aes(color = response_count), size = 4) + 
  scale_y_continuous(limits=c(0, 5), breaks=c(0,1,2,3,4,5)) +
  labs(title = "Ramen Ranking by Country",
       subtitle = "(Limited to countries at or above median response threshold; N=11.5)",
       x = "Country",
       y = "Average rating",
       color = "Response Count") +
  theme(plot.title = element_text(face="bold",hjust = 0.5),
        plot.subtitle = element_text(hjust = 0.5 ))+
  coord_flip()
plot_01

ggsave(plot_01, filename = paste("plot_01",".png",sep = "")
       , width = 8
       , height = 8
       , type = "cairo-png")

#####
#Plot 2
#####
plot_02 <- ggplot(ranking_style, aes(x=fct_reorder(style, -avg_rating), y=avg_rating)) + 
  geom_bar(stat="identity", width=.6,fill="steelblue",size=1, color="black") + 
  geom_text(aes(label=avg_rating),
            position = position_stack(vjust = 1.05))+
  theme_minimal()+
  labs(title="Preferred Ramen Serving Style", 
       subtitle="(Limited to countries at or above median response threshold; N=11.5)", 
       x = "Serving Style Category",
       y = "Average Rating") + 
  theme(plot.title = element_text(face="bold",hjust = 0.5),
        plot.subtitle = element_text(hjust = 0.5 )) +
  scale_y_continuous(limits=c(0, 5), breaks=c(0,1,2,3,4,5)) 
plot_02 

ggsave(plot_02, filename = paste("plot_02",".png",sep = "")
       , width = 8
       , height = 8
       , type = "cairo-png")
################# 
# Maruchan noodles - the old reliables
################

#Which country has the best Maruchan noodles - scatterplot 
maruchan <- ramen_ratings %>% filter(brand=="Maruchan") %>% 
  group_by(country) %>% 
  summarise(avg_rating = mean(stars),
            avg_rating = round(avg_rating,1))

plot_03 <- maruchan %>% ggplot(aes(x = fct_reorder(country, avg_rating), y = avg_rating)) +
  geom_bar(stat="identity", width=.75,fill="orange", 
           size=1, color="black") +
  geom_text(aes(label=avg_rating),
            position = position_stack(vjust = 1.05))+
  theme(legend.position = "top") + coord_flip()+
  theme_minimal() +
  scale_y_continuous(limits=c(0, 5), breaks=c(0,1,2,3,4,5))+
  labs(title="Marachun Noodles", 
       subtitle="Highest Rating by Country", 
       x = "",
       y = "Average Rating") + 
  theme(plot.title = element_text(face="bold",hjust = 0.5),
        plot.subtitle = element_text(hjust = 0.5 )) 
plot_03

ggsave(plot_03, filename = paste("plot_03",".png",sep = "")
       , width = 8
       , height = 8
       , type = "cairo-png")







