MongoMapper.connection = Mongo::Connection.new('localhost', nil, :logger => logger)

case Padrino.env
  when :development then MongoMapper.database = 'boxxes_development'
  when :production  then MongoMapper.database = 'boxxes_production'
  when :test        then MongoMapper.database = 'boxxes_test'
end
