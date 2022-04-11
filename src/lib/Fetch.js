
let common_url = 'http://172.20.10.2:3000';   //服务器地址
let token = '';   
/**
 * @param {string} url 接口地址
 * @param {string} method 请求方法：GET、POST，只能大写
 * @param {JSON} [params=''] body的请求参数，默认为空
 * @return 返回Promise
 */
export default function fetchRequest(url, method, params = '', net){
    let header = {
        "Content-Type": "application/json;charset=UTF-8",
        "withCredentials": true,
        "accesstoken": token,  //用户登陆后返回的token，某些涉及用户数据的接口需要在header中加上token
    };
    console.log('request url:',url,params);  //打印请求参数
    var requestUrl;
    if (!net) {
        requestUrl = common_url + url
    } else {
        requestUrl = url
    }
    if (net === 'upload') {
        console.log(requestUrl)
        return new Promise(function (resolve, reject) {
	        fetch(requestUrl, {
                method: method,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                body:params   //body参数，通常需要转换成字符串后服务器才能解析
            }).then((response) => response.json())
                .then((responseData) => {
	                console.log('res:',url, responseData);   //网络请求成功返回的数据
                    resolve(responseData);
                })
                .catch( (err) => {
	                console.log('err:',url, err);   //网络请求失败返回的数据  
                    reject(err);
                });
        });
    }
    if(params == ''){   //如果网络请求中没有参数
        return new Promise(function (resolve, reject) {
	        fetch(requestUrl, {
                method: method,
                mode: 'cors',
                credentials: 'include' , //携带cookie
                headers: header
            }).then((response) => response.json())
                .then((responseData) => {
                    console.log('res:',url,responseData);  //网络请求成功返回的数据
                    resolve(responseData);
                })
                .catch( (err) => {
                    console.log('err:',url, err);	  //网络请求失败返回的数据        
                    reject(err);
                });
        });
    }else{   //如果网络请求中带有参数
        return new Promise(function (resolve, reject) {
	        fetch(requestUrl, {
                method: method,
                credentials: 'include' , //携带cookie
                mode: 'cors',
                headers: header,
                body:JSON.stringify(params)   //body参数，通常需要转换成字符串后服务器才能解析
            }).then((response) => response.json())
                .then((responseData) => {
	                console.log('res:',url, responseData);   //网络请求成功返回的数据
                    resolve(responseData);
                })
                .catch( (err) => {
	                console.log('err:',url, err);   //网络请求失败返回的数据  
                    reject(err);
                });
        });
    }
}