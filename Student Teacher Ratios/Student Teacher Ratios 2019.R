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
invisible(lapply(packages, install.packages, character.only = TRUE))
invisible(lapply(packages, library, character.only = TRUE))

student_ratio <- readr::read_csv("https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2019/2019-05-07/student_teacher_ratio.csv")



library(tidyverse)
library(here)

raw_df <- read_csv(here("2019", "2019-05-07", "EDULIT_DS_06052019101747206.csv"))

clean_ed <- raw_df %>% 
  janitor::clean_names() %>% 
  mutate(indicator = str_remove(indicator, "Pupil-teacher ratio in"),
         indicator = str_remove(indicator, "(headcount basis)"),
         indicator = str_remove(indicator, "\\(\\)"),
         indicator = str_trim(indicator),
         indicator = stringr::str_to_title(indicator)) %>% 
  select(-time_2) %>% 
  rename("country_code" = location,
         "student_ratio" = value,
         "year" = time)

clean_ed %>% 
  write_csv(here("2019", "2019-05-07", "student_teacher_ratio.csv"))

