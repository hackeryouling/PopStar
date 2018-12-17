import { Map } from "./Map";

export class HttpManager {

	//请求类型
	private static _responseType: string;
	//请求地址
	private static _requestUrl: string;
	//method请求方式:GET/POST
	private static _method: string;
	//回调函数
	private static _succCallback: Function;
	private static _failCallback: Function;
	//参数列表
	private static _paramList: Map;

	public constructor() {
		// throw (new SimpleError("HttpManager can't call constructor!"));
	}

	/** 初始化连接 */
	public static init(url: string, responseType: string = "text", method: string = "GET",
		succCallback: Function = null, failCallback: Function = null): void {
		HttpManager._responseType = responseType;
		HttpManager._requestUrl = url;
		HttpManager._method = method;
		HttpManager._succCallback = succCallback;
		HttpManager._failCallback = failCallback;
		HttpManager._paramList = new Map();
	}

	/** 添加参数 */
	public static addParam(key: string, value: string): void {
		HttpManager._paramList.put(key, value);
	}

	/** 发送请求 */
	public static send(data: string = null): void {
		let xhr = cc.loader.getXMLHttpRequest();

		let param = HttpManager._getParamStr();
		if (HttpManager._method == "GET") {
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
					if (xhr.status >= 200 && xhr.status < 300) {
						let respone = xhr.responseText;
						HttpManager.onPostComplete(respone);
					} else {
						HttpManager.onPostIOError();
					}
				}
			};
			let url = HttpManager._requestUrl;
			if (param != null && param != "") {
				url = url + "?" + param;
			}
			xhr.open(HttpManager._method, url, true);
			// xhr.open(HttpManager._method, HttpManager._requestUrl + "?" + param, true);
			if (cc.sys.isNative) {
				xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
			}
			xhr.timeout = 5000;// 5 seconds for timeout
			xhr.send();
		} else if (HttpManager._method == "POST") {
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
					if (xhr.status >= 200 && xhr.status < 300) {
						let respone = xhr.responseText;
						HttpManager.onPostComplete(respone);
					} else {
						HttpManager.onPostIOError();
					}
				}
			};
			xhr.open(HttpManager._method, HttpManager._requestUrl, true);
			if (cc.sys.isNative) {
				xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
			}

			xhr.timeout = 5000;// 5 seconds for timeout
			if (data) {
				xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				xhr.send(data);
			} else {
				xhr.send(param);
			}

		}
		HttpManager._paramList.clear();
	}

	private static onPostComplete(response: string) {
		HttpManager._succCallback && HttpManager._succCallback(response);
	}

	private static onPostIOError(): void {
		HttpManager._failCallback && HttpManager._failCallback();
	}

	private static onPostProgress(): void {
	}

	//获取参数
	private static _getParamStr(): string {
		let param = "";
		let list = HttpManager._paramList.getList();
		for (let i = 0; i < list.length; i++) {
			let key = list[i].key;
			let value = list[i].value;
			param = param + key + "=" + value + "&";
		}
		param = param.substr(0, param.length - 1);
		return param;
	}
}