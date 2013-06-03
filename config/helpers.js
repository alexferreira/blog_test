helper = {};

helper.truncate = function ( val, len ){
  val=val.replace(/<br>/gi, "\n");
  val=val.replace(/<p.*>/gi, "\n");
  val=val.replace(/<(?:.|\s)*?>/gm, "");

  if( val.length <= len ) return val;
  if( len <= 3 )          return '...';
  if( val.length > len - 3 ){
    return val.substr( 0, len - 3 ) + '...';
  }

  return val;
};

module.exports = helper;