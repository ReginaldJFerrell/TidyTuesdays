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

ramen_ratings <- readr::read_csv("https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2019/2019-06-04/ramen_ratings.csv")%>% 
  na.omit(stars)

#Ranking by country
ranking_country <- ramen_ratings %>% 
  group_by(country) %>% 
  summarise(avg_rating = mean(stars),
         max_rating = max(stars),
         min_rating = min(stars),
         sd = sd(stars))



#Maruchan noodles
maruchan <- ramen_ratings %>% filter(brand=="Maruchan")

#Rating for maruchan noodles
rating_maruchan <- maruchan %>% group_by(brand,style) %>% 
  summarise(avg_rating = mean(stars))

#Rating for country
rating_maruchan_country <- maruchan %>% 
  mutate(rating_count = ifelse(review_number !="",1,0)) %>% 
                  group_by(brand,style,country) %>% 
                    summarise(avg_rating = mean(stars),
                             rating_count = sum(rating_count))

# rating_country <- ramen_ratings %>% group_by(brand,style,country) %>% 
#   summarise(avg_rating = mean(stars))
# 
# brand_country <- ramen_ratings %>% group_by(brand,style,country) %>% 
#   summarise(avg_rating = mean(stars))


 ##### Plots
style <- ggplot(rating_maruchan_country,aes(x = style, y = avg_rating,fill = style)) + 
  geom_bar(stat = "identity", position = "dodge") + theme_minimal() +
  facet_grid(~country)


country <- ggplot(ranking_country) +
  geom_bar( aes(x=country, y=avg_rating), stat="identity", fill="skyblue", alpha=0.5) +
  geom_errorbar( aes(x=country, ymin=min_rating, ymax=max_rating), width=0.4, colour="orange", alpha=0.9, size=1.3) +
  coord_flip()

country <- ggplot(ranking_country) +
  geom_bar( aes(x=country, y=avg_rating), stat="identity", fill="black", alpha=0.5) +
  geom_errorbar( aes(x=country, ymin=avg_rating-sd, ymax=avg_rating+sd), width=0.4, colour="orange", alpha=0.9, size=1.5) +
  ggtitle("using standard deviation")+
  coord_flip() + theme_minimal()




