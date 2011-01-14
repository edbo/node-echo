class Defaults
  def initialize(config)
    @config = config
    @valid_info = @config['valid_info']
  end

  def get_valid_bus(channel)
    @config['base_url'] + '/' + @config['backplane']['version'] + '/' + @valid_info['bus'] + '/channel/' + channel
  end
  
  def get_valid_token()
    @config['valid_info']['key']
  end

  def get_valid_auth_header()
     'Basic ' + Base64.encode64(@valid_info['bus'] + ':' + @valid_info['key'])
  end
end