Boxxes.controllers :accounts, :provides => [:json, :html] do    
  before(:edit, :update, :destroy) do  
    @account = current_account 
    halt 403, 'Login first' unless @account
  end
  
  get :new do
    @account = Account.new
    respond(@account)
  end

  post :create, :protect => true do       
    if current_account  
      flash[:notice] = "You are already registered"  
      redirect_back_or_default(url(:boxes, :index))
    end 
        
    @account = Account.new(params[:account])   
    @account.save
    respond(@account, url(:accounts, :edit))
  end   

  get :edit do    
    respond(@account)
  end

  put :update, :protect => true do      
    @account.update_attributes(params[:account])  
    respond(@account, url(:accounts, :edit))
  end      

  delete :destroy, :protect => true do
    @account.destroy
    respond(@account, url(:boxes, :index)) 
  end        
end