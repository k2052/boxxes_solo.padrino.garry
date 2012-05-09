require File.expand_path(File.dirname(__FILE__) + '/../../test_config.rb')

describe "AccountsController" do     
  context "ajax create" do     
    setup do   
      header 'Accept', 'application/json' 
    end
    
    should "return a new account" do  
      get "/accounts/new.json" 
      assert last_response.status == 200
    end  
    
    should "create a new account" do 
      account = {:email => Faker::Internet.email, :username => Faker::Internet.user_name, :name => Faker::Name.name, :password => 'testpass', 
        :password_confirmation => 'testpass'}     
      post "/accounts/create.json", {"account" => account}, :xhr => true
                            
      assert last_response.status == 200    
      account = JSON.parse(last_response.body)   
      assert account[:status] != 'fail'
    end 
  end              
  
  context "ajax edit" do   
    setup do  
      @account_ajax_edit = Account.first(:first_name.ne => 'Bob')   
      
      post '/sessions/create', {:email => @account_ajax_edit.email, :password => 'testpass'}  
      assert last_response.status == 302       
      
      follow_redirect!
      
      assert_equal "http://example.org/", last_request.url  
      
      header 'Accept', 'application/json'    
    end
    
    should "respond to edit" do    
      get '/accounts/edit.json', :xhr => true
      assert last_response.status == 200  
    end 
    
    should "respond to update" do         
      put '/accounts/update.json', {:account => {:name => "Bob, Johnson"}}, :xhr => true             
      
      assert last_response.status == 200  
      account = JSON.parse(last_response.body)['data']['account']    
      assert_equal account['first_name'], "Bob"  
      assert_equal account['last_name'], "Johnson"  
    end
    
    should "respond to destroy" do         
      delete '/accounts/destroy.json', {}, :xhr => true       
      assert last_response.status == 200 
    end
  end     

  context "normal request creates" do
    setup do   
      header 'Accept', 'text/html' 
    end       
    
    should "return a new account page" do  
      get "/accounts/new"          
      assert last_response.status == 200
    end  
    
    should "create a new account" do    
      get "/accounts/new"          
      assert last_response.status == 200      
      
      account = {:email => Faker::Internet.email, :username => Faker::Internet.user_name, :name => Faker::Name.name, :password => 'testpass', 
        :password_confirmation => 'testpass'}     
      post "/accounts/create", "account" => account, :_csrf_token => last_request.session[:_csrf_token]   
             
      assert last_response.status == 302       
      
      follow_redirect!
      
      assert_equal "http://example.org/accounts/edit", last_request.url
    end   
  end  

  context "normal request edits" do  
    setup do  
      @accountn = Account.first()
      
      post '/sessions/create', {:email => @accountn.email, :password => 'testpass'}  
      assert last_response.status == 302       
      
      follow_redirect!
      
      assert_equal "http://example.org/", last_request.url    
      
      header 'Accept', 'text/html' 
    end
    
    should "return an edit page" do    
      get '/accounts/edit'
      assert last_response.status == 200  
    end 
    
    should "respond to update" do
      get '/accounts/edit'          
      assert last_response.status == 200  
               
      put '/accounts/update', {:account => {:name => "Bob, Johnson"}, :_csrf_token => last_request.session[:_csrf_token] }      
      assert last_response.status == 302
      follow_redirect!
      
      assert_equal "http://example.org/accounts/edit", last_request.url
    end
    
    should "respond to destroy" do   
      get '/accounts/edit'
      assert last_response.status == 200
            
      delete '/accounts/destroy', :_csrf_token => last_request.session[:_csrf_token]   
      assert last_response.status == 302   
      
      follow_redirect!
      
      assert_equal "http://example.org/", last_request.url 
    end
  end
end