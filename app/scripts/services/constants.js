/**
 * Created by bujjibabu balga on 09/20/2016
 */
angular.module('healthCareApp').constant( 'healthCareBusinessConstants', {
  "LOGIN_URL": 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/login',
  "SEARCH_URL": 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/employeesearch',
  "STAFF": 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/status/staff',
  "FACILITY": 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/status/Facility',
  "DELETE_URL": 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/employeeDelete',
  "ADD": 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/employeeAdd',
  "EDIT": 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/hsm/employeeEdit'
 });