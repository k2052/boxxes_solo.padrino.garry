Boxxes.controllers :boxes, :provides => [:json, :html] do      
  before(:index, :list) do 
    if params[:page]     
      @pagenum = params[:page].to_i
      halt 403, "Malformed Pagenum" if !@pagenum.is_a?(Numeric)  
    else  
      @pagenum = 0     
    end
  end    
  
  before(:index, :list) do  
    options = {} 
    if request.xhr? or mime_type(:json) == request.preferred_type  
      @boxes = Box.all(:skip => @pagenum * 10, :limit => 25)
    else   
      @pager = Paginator.new(Box.count, 10) do |offset, per_page|
        options[:skip] = offset 
        options[:limit] = per_page
        Box.all(options)  
      end
      @boxes = @pager.page(@pagenum)
    end
  end 
  
  before(:show, :buy, :purchase) do       
    @box = Box.find_by_slug(params[:slug])  
    halt 404, 'Box not found.' unless @box
  end        
  
  get :index, :map => '/' do    
    respond(@boxes)  
  end       
  
  get :list, :map => "/boxes/(page)/(:page)" do       
    respond(@boxes)
  end 
  
  get :buy, :map => '/buy/:slug' do   
    if current_account           
      @account = current_account
    else
      @account = Account.new
    end
                      
    render "boxes/buy", :layout => false
  end   
  
  get :show, :map => '/boxes/:slug' do 
    respond(@box)
  end 
  
  post :purchase, :map => '/buy/:slug', :protect => true do   
    if current_account           
      @account = current_account
      @account.update_attributes(params[:account])
    else    
      @account = Account.new(params[:account])
    end
       
    if @account.save      
      if @account.purchase(@box) 
        if @account.save              
          @download = Download.new(:box_id => @box.id, :account_id => @account.id)    
          unless @download.save    
            @account.errors.add :download, @download.errors.full_messages       
          end  
        end
      end
    end 
    
    respond(@account, url(:boxes, :show, :slug => @box.slug))
  end    
  
  get :my_files, :map => '/my-files' do   
    @boxes = current_account.boxes 
    respond(@boxes)
  end 
  
  get :download, :map => '/boxes/download/:id' do         
    box = Box.find_by_id(params[:id]) 
    halt 403, 'You are not allowed to access this file.' unless current_account.purchased?(box)
    send_file box.file.current_path    
  end
end