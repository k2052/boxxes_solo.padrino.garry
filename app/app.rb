require 'padrino/sprockets'
require "stripe"   
require "garry"
Stripe.api_key = ENV['STRIPE_KEY']           
   
class Boxxes < Padrino::Application  
  use Airbrake::Rack     
  register Padrino::CSRF
  register Padrino::Rendering
  register Padrino::Helpers   
  register Padrino::Admin::AccessControl 
  register CompassInitializer

  enable :sessions        
  
  set :stylesheets_folder, :css
  set :javascripts_folder, :js
  register Padrino::AssetHelpers
  register Padrino::Sprockets   
  register Padrino::Responders    
  register Sprockets::Jquery::Tmpl::App    
    
  disable :prevent_request_forgery
  
  ## 
  # Assets
  #
  
  assets do    
    digest false  
    handle_stylesheets false  
    assets_folder '/public'
    append_path 'assets/js'  
    append_path '../lib/assets/js'
    append_path '../vendor/assets/js'   
  end  
  
  access_control.roles_for :any do |role|
    role.protect "/my-files"   
    role.protect "/boxes/download/*"
    role.allow   "/accounts/create"    
    role.allow   "/accounts/new" 
    role.project_module :sessions, '/sessions'
  end
  
  access_control.roles_for :registered do |role|
    role.project_module :accounts, '/accounts'   
    role.allow '/my-files'  
    role.allow "/boxes/download/*"
  end
end