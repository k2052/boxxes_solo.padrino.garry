# Stripe 
if Padrino.env == :development or  Padrino.env == :test  
  ENV['STRIPE_KEY']     = 'xxx'
  ENV['STRIPE_PUB_KEY'] = 'xxx'        
end

ENV['STRIPE_KEY']       = 'xxx'  if Padrino.env == :production
ENV['STRIPE_PUB_KEY']   = 'xxx'  if Padrino.env == :production  
ENV["AIRBRAKE_API_KEY"] = 'xxx'         
ENV['EMAIL']            = 'xxx'  
ENV['POSTMARK_API_KEY'] = 'xxx' 