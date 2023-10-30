// import * as packageJson from "../package.json"
import {  
  OnGroupServiceClose,
  OnGroupServiceReceive,
  OnGroupServiceMemberJoin,
  OnGroupServiceMemberLeave,
  OnGroupMemberStatusChange,
} from './types'

// declare var zmcserver: ZMCServer;
// declare var zbase:ZBase;

let packageJson: any = {}
export function init(dmappId: string) {
  packageJson.dmappId = dmappId;

  zmcserver.registerMSInterface(
    packageJson.dmappId, 'main', groupName,
    //OnGroupServiceClose
    (groupsid: string) => {
      zbase.log('OnGroupServiceClose');
    },
    //OnGroupServiceReceive
    (groupsid: string, strMemberId: number, strdata: string) => {
      zbase.log('OnGroupServiceReceive');
      (async () => {
        try {
          let apiArgs: ApiArgs = JSON.parse(strdata)
          let result: ApiResult = {
            callBackId: apiArgs.callBackId,
            code: 0,
          };
          zbase.log(`===========strdata:${strdata} result:${JSON.stringify(result)}`)

          try {
            if (apiArgs.name in apiMap) {
              let api: ApiFunction = apiMap[apiArgs.name];
              let resData = await api(apiArgs.args)
              result.result = resData;
            } else {
              throw `dmappId:${packageJson.dmappId} serviceName:main groupName:${groupName} api not found name:${apiArgs.name}`
            }
            zbase.log(`================call api ok result:${JSON.stringify(result)}`)
            zmcserver.sendMsgToMember(groupsid, strMemberId, JSON.stringify(result));
          } catch (e) {
            result.code = -1
            result.errMsg = `${e}`
            zmcserver.sendMsgToMember(groupsid, strMemberId, JSON.stringify(result));
          }
        } catch (e) {
          zbase.log(`dmappId:${packageJson.dmappId} serviceName:main groupName:${groupName} parse:${strdata}`)
        }

      })()
    },
    //OnGroupServiceMemberJoin
    (groupsid: string, memberId: number, userinfo: string) => {
      zbase.log('OnGroupServiceMemberJoin');
    },
    //OnGroupServiceMemberLeave
    (groupsid: string, memberId: number) => {
      zbase.log('OnGroupServiceMemberLeave');
    },
    //OnGroupMemberStatusChange
    (groupsid: string, memberId: number, status: number) => {
      zbase.log('OnGroupMemberStatusChange');
    }
  );
}


if (!zmcserver) {
  zmcserver = {
    registerMSInterface: (dmappId: string, serviceName: string, groupName: string,
      OnGroupServiceClosefuc: OnGroupServiceClose,
      OnGroupServiceReceivefuc: OnGroupServiceReceive,
      OnGroupServiceMemberJoinfuc: OnGroupServiceMemberJoin,
      OnGroupServiceMemberLeavefuc: OnGroupServiceMemberLeave,
      OnGroupMemberStatusChangefuc: OnGroupMemberStatusChange,) => {
      return ""
    },

    /**
     * 发送数据给服务组
     * 给本服务组内发送的数据
     * @param groupsid 表示服务组id号
     * @param memberId 表示服务组内成员id,不需要接收此条组消息，此值为0时，所有组员收到消息
     * @param strdata 表示发送数据给本服务组内
     * @returns 返回” ok”表示发送成功，返回”net error”表示网络错误。
     */
    sendMsgToGroup(groupsid: string, memberId: number, strdata: string): 'ok' | 'net error' | void {

    },
    /**
     * 发送数据给服务组内某成员
     * 给本服务组内某成员发送数据
     * @param groupsid 
     * @param strMemberId 
     * @param strdata 
     * @returns 返回” ok”表示发送成功，返回”net error”表示网络错误。
     */
    sendMsgToMember(groupsid: string, memberId: number, strdata: string): 'ok' | 'net error' | void {

    },

    /**
     * 设置微服务组心跳超时多久通知离线
     * 设置微服务组成员心跳超时多久通知为离线状态，并通知js服务端成员状态改变；此接口为api调用类型。
     * @param groupsid 表示服务组id号
     * @param unmsec 表示心跳超时时间，毫秒(范围1000-66060*1000毫秒)
     * @param 0为成功，非0失败；
     */
    setMsHeartTimeoutOffline(groupsid: string, unmsec: number): number {
      return 0;
    },

    /**
     *  设置微服务组心跳超时多久通知离开
     * 设置微服务组成员心跳超时多久通知为离开状态，微服务管理将成员踢出房间，并通知js服务端
     * 返回值说明Uint32，0为成功，非0失败；
     * @param groupsid 表示服务组id号
     * @param unmsec 表示心跳超时时间，毫秒(范围1000-66060*1000毫秒)
     * @param 0为成功，非0失败；
     */
    setMsHeartTimeoutLeave(groupsid: string, unmsec: number): number {
      return 0;
    },

    /**
     * 
     * @param indvdata 输入哈希前的数据
     * @param len 指定哈希后的输出长度
     * @returns [number,DataView]
     * number 0为成功，其他值:参考define_error中的Database错误码说明
     * DataView 哈希后的数据
     */
    blake2s(indvdata: DataView, len: number): [number, DataView] {
      return [0, new DataView(new Uint8Array(8).buffer)]
    },

    /**
     * MD5
     * @param instr 输入计算md5的源数据
     */
    md5(instr: string): string {
      return '';
    }
  }
}
declare var global: any;
const groupName = global.zolpar;

interface ApiFunction {
  (req: any): Promise<any>
}
interface ApiArgs {
  callBackId: string,
  name: string,
  args?: any,
}
interface ApiResult {
  callBackId: string,
  code: number,
  errMsg?: string,
  result?: any
}


const apiMap: {
  [key: string]: ApiFunction,
} = {}


export function registerApi(name: string, api: ApiFunction) {
  apiMap[name] = api;
}
