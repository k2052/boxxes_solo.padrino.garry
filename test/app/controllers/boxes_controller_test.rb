require File.expand_path(File.dirname(__FILE__) + '/../../test_config.rb')

describe "BoxesController" do
  
  context "ajax" do 
    setup do   
      header 'Accept', 'application/json'     
       
      @account_box_ajax = Account.purchased.first(:last_4_digits.ne => nil)     
        
      post('/sessions/create',  {:email => @account_box_ajax.email, :password => 'testpass'})
      assert last_response.status == 302     
        
      follow_redirect!
      
      assert_equal "http://example.org/", last_request.url     
      
      @account_box_ajax = Account.find_by_id(@account_box_ajax.id)
    end
     
    should "list boxes" do
      get '/', {}, :xhr => true 
      assert last_response.status == 200     
      
      boxes = JSON.parse(last_response.body)      
      assert !boxes[0]['slug'].blank?     
      assert boxes.length > 1  
    end  
    
    should "paginate boxes" do
      get '/boxes/page/1', {}, :xhr => true 
      assert last_response.status == 200     
    
      boxes = JSON.parse(last_response.body)      
      assert !boxes[0]['slug'].blank?     
      assert boxes.length > 1 
    end  
    
    should "list an accounts purchased boxes" do      
      get '/my-files.json', {}, :xhr => true      
      assert last_response.status == 200   
      
      boxes = JSON.parse(last_response.body)      
      assert !boxes[0]['slug'].blank?     
    end  
    
    should "purchase a box" do      
      box = Box.first(:_id.ne => @account_box_ajax.purchased_ids)
      get "/buy/#{box.slug}", :xhr => true
      
      post("/buy/#{box.slug}", {:account => {:name => "Bob, Johnson"}, 
        :_csrf_token => last_request.session[:_csrf_token]}, :xhr => true)  
      assert last_response.status == 200   
      
      account = JSON.parse(last_response.body)['data']['account']    
      assert_equal account['first_name'], "Bob"  
      assert_equal account['last_name'], "Johnson"   
      account = Account.find_by_id(@account_box_ajax.id)   
      assert account.purchased?(box) == true
    end
  end   
  
  context "normal and logged out" do  
    setup do   
      header 'Accept', 'text/html'  
      @account_box_normal = Account.purchased.first(:last_4_digits.ne => nil)         
      get '/logout'
    end     
     
    should "list boxes" do  
      get '/', {}
      assert last_response.status == 200     
    end
    
    should "paginate boxes" do  
      get '/boxes/page/1'
      assert last_response.status == 200
    end   
    
    should "not list an accounts purchased boxes" do
      get '/my-files'   
      assert last_response.status == 401
    end  
    
    should "refuse access to download box" do   
      box = Box.first(:_id.ne => @account_box_normal.purchased_ids) 
      get "/boxes/download/#{box.slug}"   
      assert last_response.status == 401 
    end
  end 
  
  context "normal and account logged in" do
    setup do     
      header 'Accept', 'text/html'     
      
      @account_box_normal = Account.purchased.first(:last_4_digits.ne => nil)  
      
      post '/sessions/create', {:email => @account_box_normal.email, :password => 'testpass'}  
      assert last_response.status == 302       
      
      follow_redirect!
      
      assert_equal "http://example.org/", last_request.url  
         
      @account_box_normal = Account.find_by_id(@account_box_normal.id)
    end           
    
    should "list an accounts purchased boxes" do
      get '/my-files'   
      assert last_response.status == 200
    end
     
    should "return a buy box page" do   
      box = Box.first() 
      
      get "/buy/#{box.slug}"
      assert last_response.status == 200
    end   
     
    should "purchase a box" do
      box = Box.first(:_id.ne => @account_box_normal.purchased_ids)
    
      get "/buy/#{box.slug}"
       
      post("/buy/#{box.slug}", {:account => {:name => "Bob, Johnson"}, 
         :_csrf_token => last_request.session[:_csrf_token]})  
      assert last_response.status == 302  
      
      account = Account.find_by_id(@account_box_normal.id)
      assert account.purchased?(box)
    end   
    
    should "return a box download" do  
      box = Box.first(:id => @account_box_normal.purchased_ids) 
     
      get "/boxes/download/#{box.id}"  
      assert last_response.status == 200
    end   
       
    # TODO Look into mongomapper issue with :id.ne => Array queries    
    # Appears to have been fixed on strings only.
    # https://github.com/jnunemaker/mongomapper/issues/125
    should "refuse to return a box" do   
      box = Box.new(:title => Faker::Lorem.words(3).join(" "), :price => Random.rand(4200-100) + 100, :desc => Faker::Lorem.paragraphs(2).join(" "))
      box.file = File.open(File.expand_path(File.dirname(__FILE__) + '/../../data/demo.zip'))
      box.save
      get "/boxes/download/#{box.id}"       
      assert last_response.status == 403 
    end
  end
end