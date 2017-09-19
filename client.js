var http = require('http');

// HTTPRequest�� �ɼ� ����
var options = {
   host: 'localhost',
   port: '8081',
   path: '/index.html'  
};

// �ݹ� �Լ��� Response�� �޾ƿ´�
var callback = function(response){
   // response �̺�Ʈ�� �����Ǹ� �����͸� body�� �޾ƿ´�
   var body = '';
   response.on('data', function(data) {
      body += data;
   });
   
   // end �̺�Ʈ�� �����Ǹ� ������ ������ �����ϰ� ������ ����Ѵ�
   response.on('end', function() {
      // ������ ���� �Ϸ�
      console.log(body);
   });
}
// ������ HTTP Request �� ������.
var req = http.request(options, callback);
req.end();
