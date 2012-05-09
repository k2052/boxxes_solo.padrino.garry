##
# Setup global project settings for your apps. These settings are inherited by every subapp. You can
# override these settings in the subapps as needed.
#
Padrino.configure_apps do
  # enable :sessions
  set :session_secret, '13a8b35ebb99a96ae23216b70c1a3363f41d6e7e38684f93cc7ee9e508e2a139'
end

# Mounts the core application for this project
Padrino.mount("Boxxes").to('/')
