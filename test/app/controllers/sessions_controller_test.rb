require File.expand_path(File.dirname(__FILE__) + '/../../test_config.rb')

describe "SessionsController" do
  
  context "normal" do 
    setup do     
      header 'Accept', 'text/html'     
    end
    
    should "respond to new" do       
      get '/login'
      assert last_response.status == 200
    end                
    
    should "create a session" do        
      account = Account.first()       
      
      post '/sessions/create', {:email => account.email, :password =>'testpass'}  
      assert last_response.status == 302
    end
    
    should "destroy a session" do
      account = Account.first  
      
      post '/sessions/create', {:email => account.email, :password => 'testpass'}  
      assert last_response.status == 302
      
      delete '/logout'   
      assert last_response.status == 302
    end
    
    should "logout" do   
      account = Account.first  
    
      post '/sessions/create', {:email => account.email, :password => 'testpass'}  
      assert last_response.status == 302
      
      get '/logout'   
      assert last_response.status == 302
    end
  end
end