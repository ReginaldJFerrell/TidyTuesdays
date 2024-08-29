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
invisible(lapply(packages, library, character.only = TRUE))

# Get the Data
# Scroll to the end of this code block to see how to recombine the data into a
# graph!

# Option 1: tidytuesdayR package 
## install.packages("tidytuesdayR")

tuesdata <- tidytuesdayR::tt_load('2023-09-26')
## OR
tuesdata <- tidytuesdayR::tt_load(2023, week = 39)

richmondway <- tuesdata$richmondway

# Option 2: Read directly from GitHub

richmondway <- readr::read_csv('https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2023/2023-09-26/richmondway.csv')
