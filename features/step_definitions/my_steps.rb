Given /^a valid api key$/ do

end

Given /^an invalid api key$/ do

end

Then /^I should receive an HTTP Response code of "(\d+)"$/ do |expected_response|
  @response.code.to_s().should == expected_response
end

And /^the message "([^"]*)"$/ do |expected_message|
  @response.message.to_s().should == expected_message
end