/**
 * Created by bujjibabu balga on 09/20/2016
 */
angular.module('healthCareApp').constant( 'healthCareBusinessConstants', {
  "LOGIN_URL": 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/login',
  "PERSONAL_SEARCH_URL": 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/personnel/search',
  "STAFF": 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/status/staff',
  "FACILITY": 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/status/Facility',
  "DELETE_EMP": 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/employeeDelete?empID=',
  "ADD_EMPLOYEE": 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/employeeAdd',
  "EDIT_EMPLOYEE": ' http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/employeeEdit',
  'DELETE_DOC': 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/deleteDocument?docID=',  
  'GET_DOC': 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/getDocument?docID=',
  'SAVE_DOC': 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/documentSave',
  'UPDATE_DOC': 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/documentUpdate',
  'GET_USERS': 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/admin/users',
  'PERSONAL_UPDATE': 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/personnel/update',
  'PERSONAL': 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/personnel',
  'GET_LOCATIONS': 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/organization/location',
  'GET_COMPANIES': 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/organization/company',
  'GET_LOCATIONS_LIST': 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/organization/locationList',
  'GET_STATES_LIST' : 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/states',
  'SEARCH_USER': 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/admin/users/search',
  'SEARCH_LOCATION': 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/organization/location/search',
  'SUPERVISOR_LIST': 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/supervisorList',
  'SPECIALTY_LIST': 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/specialtyList',
  'LOG_OUT': 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/logout',
  'CREATE_LICENSE': 'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/license',
  'PERSONAL_STATUS':'http://managementportal-env.us-east-1.elasticbeanstalk.com/hsm/secure/status/personal'
 });