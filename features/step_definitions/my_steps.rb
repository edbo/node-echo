And /^the api key "(.*)"$/ do |api_key|

end

When /^I post a valid message to a random channel$/ do
  @response = RestClient.post @defaults.get_valid_bus(@uuid.generate), { 'x' => 1 }.to_json, :Authentication => @defaults.get_valid_auth_header(), :content_type => :json
end

Then /^I should receive an HTTP Response code of "(\d+)"$/ do |expected_response|
  @response.code.to_s().should == expected_response
end

Then /^I should receive response code "(\d+)" with message "([^"]*)"$/ do |expected_response,expected_message|
  Then "I should receive an HTTP Response code of \"" + expected_response + "\""
  @response.message.to_s().should == expected_message
end