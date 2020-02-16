source("./config.R")
source("./util.R")
suppressMessages(library(tidyr))
suppressMessages(library(dplyr))
suppressMessages(library(ggplot2))
suppressMessages(library(svglite))

pattern = '^(\\d\\d\\/\\d\\d\\/\\d\\d), (\\d?\\d:\\d\\d ..) - (.+?): (.*)$'
args = commandArgs(trailingOnly = TRUE)
if(length(args) != 1) {
  print('Provide the chat file as a command line argument!')
  quit()
} 

# Create output directory
setwd("/home/app")
dir.create(file.path('/home/app', 'output'), showWarnings = FALSE)

# Set Theme options for ggplot
theme_opts = theme(axis.text.x = element_text(angle = 30, hjust = 1), 
                   panel.background = element_rect(fill = CONFIG_PANEL_BG_COLOR), 
                   plot.background = element_rect(fill = CONFIG_PLOT_BG_COLOR))

################################################################################
# DATA EXTRATION
################################################################################

printlog("Reading file")

# Read Raw Chats
chat = read.table(file = args[1], header = TRUE, sep = "\t", quote = "", 
                  dec = ".", col.names = c('raw'), stringsAsFactors = FALSE, 
                  fill = TRUE)

# Check if multi-line texts need to be merge
chat$needs_merge = !grepl(pattern, chat$raw)

# Merge them & drop the multi-line texts
for(index in 1:nrow(chat)) {
  if(chat[index, "needs_merge"]) {
    target_index = index - 1
    # For more than 2 line texts
    while(chat[index, "needs_merge"]) {
      chat[target_index, "raw"] = paste(chat[target_index, "raw"], chat[index, "raw"])
      index = index + 1
    }  
  }
}

chat = chat[!chat$needs_merge, c("raw"), drop = FALSE]

# Seperate raw into fields
chat = extract(chat, raw, into = c("date", "time", "sender", "text"), regex = pattern)

# Convert 12HR scheme to 24HR
chat$time = format(strptime(chat$time, "%I:%M %p"), format="%H:%M")

chat$date = as.Date(chat$date, format="%d/%m/%y")
chat$sender = factor(chat$sender)

################################################################################
# EXPLORATORY ANALYSIS
################################################################################

# Group By Sender
chat_group_sender = chat %>%
  group_by(sender) %>% 
  summarise(messages = length(sender)) %>% 
  arrange(messages) %>%
  mutate(percentage = 100 * messages/sum(messages)) %>%
  mutate(label = paste0(messages, " (", format(round(percentage, 2), nsmall = 2),"%)"))

# Timeline By Sender
chat_timeline_sender = chat %>% 
  group_by(date, sender) %>% 
  summarise(messages = length(sender)) %>%
  arrange(messages) %>%
  mutate(percentage_of_day = 100 * messages/sum(messages)) %>%
  drop_na(date)

printlog('Generating Sender Statistics')
plot1_sender_stats = chat_group_sender %>%
  ggplot(aes(y = messages, x = sender, label = label)) + 
    geom_bar(stat = "identity", fill = CONFIG_PRIMARY_COLOR) + 
    geom_text(size = 3, position = position_stack(vjust = 0.5)) +
    coord_flip() +
    theme_opts 
saveplot(plot1_sender_stats)

printlog('Generating Sender Timeline')
plot2_sender_timeline = chat_timeline_sender %>%
  ggplot(aes(x = date, y = messages, group = sender, color = sender)) + 
  geom_line() + 
  scale_x_date() +
  theme_opts
saveplot(plot2_sender_timeline)

printlog('Generating Sender Percentage Timline')
plot3_sender_percentage_timeline = chat_timeline_sender %>% 
  ggplot(aes(x = date, y = percentage_of_day, fill = sender)) + 
  geom_bar(stat = "identity") +
  theme_opts
saveplot(plot3_sender_percentage_timeline)

quit(save = 'yes')