/**
 * Created by bujjibabu balga on 09/20/2016
 */
angular.module('healthCareApp').constant( 'healthCareBusinessConstants', {
  "LOGIN_URL": 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/login',
  "SEARCH_URL": 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/employeesearch',
  "STAFF": 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/status/staff',
  "FACILITY": 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/status/Facility',
  "DELETE_EMP": 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/employeeDelete?empID=',
  "ADD_EMPLOYEE": 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/employeeAdd',
  "EDIT_EMPLOYEE": ' http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/employeeEdit',
  'DELETE_DOC': 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/deleteDocument?docID=',  
  'GET_DOC': 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/getDocument?docID=',
  'SAVE_DOC': 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/documentSave'
 });