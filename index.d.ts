
/**
 * 微服务事件回调函数
 * 微服务管理组关闭时的异步通知；此接口为消息通知类型，底层所有数据后通知上层。
 * @param groupsid 表示服务组id号
 */
type OnGroupServiceClose = (groupsid: string) => void;

/**
 * 微服务组内接收成员发来的数据通知
 * 接受到组内成员发来的数据；此接口为消息通知类型，底层所有数据后通知上层。
 * @param groupsid 表示服务组id号
 * @param strMemberId 表示服务组内成员id
 * @param strdata 表示发送的数据
 */
type OnGroupServiceReceive = (groupsid: string, strMemberId: number, strdata: string) => void;

/**
 * 微服务组内新成员加入通知
 * 接受到组内成员发来的数据；此接口为消息通知类型，底层所有数据后通知上层。
 * @param groupsid 表示服务组id号
 * @param memberId 表示服务组内成员id
 * @param userinfo 表示加入成员的用户信息等
 */
type OnGroupServiceMemberJoin = (groupsid: string, memberId: number, userinfo: string) => void;


/**
 * 微服务组成员状态变更通知
 * 组发生状态时的变化通知；此接口为消息通知类型，底层所有数据后通知上层。
 * @param groupsid 表示服务组id号
 * @param memberId 表示服务组内成员id
 * @param status 为组状态变化值，1为在线，0为离线;
 */
type OnGroupMemberStatusChange = (groupsid: string, memberId: number, status: number) => void;
/**
 * 微服务组内成员离开通知
 * 组内成员离开时收到的消息；此接口为消息通知类型，底层所有数据后通知上层。
 * @param groupsid 表示服务组id号
 * @param memberId 表示服务组内成员id
 */
type OnGroupServiceMemberLeave = (groupsid: string, memberId: number) => void;

export interface zmcserver {
    /**
     * 
     * @param dmappId 
     * @param serviceName 
     * @param groupName 
     * @param OnGroupServiceClosefuc 微服务组关闭时的通知函数
     * @param OnGroupServiceReceivefuc 微服务组内接收成员发来的数据通知函数
     * @param OnGroupServiceMemberJoinfuc 微服务组内新成员加入通知函数
     * @param OnGroupServiceMemberLeavefuc 微服务组内成员离开通知函数
     * @param OnGroupMemberStatusChangefuc 微服务组成员状态变更通知函数
     * @returns Groupid微服务管理组id的十六进制字符。
     */
    registerMSInterface(
        dmappId: string, serviceName: string, groupName: string,
        OnGroupServiceClosefuc: OnGroupServiceClose,
        OnGroupServiceReceivefuc: OnGroupServiceReceive,
        OnGroupServiceMemberJoinfuc: OnGroupServiceMemberJoin,
        OnGroupServiceMemberLeavefuc: OnGroupServiceMemberLeave,
        OnGroupMemberStatusChangefuc: OnGroupMemberStatusChange,
    ): string

    /**
     * 发送数据给服务组
     * 给本服务组内发送的数据
     * @param groupsid 表示服务组id号
     * @param memberId 表示服务组内成员id,不需要接收此条组消息，此值为0时，所有组员收到消息
     * @param strdata 表示发送数据给本服务组内
     * @returns 返回” ok”表示发送成功，返回”net error”表示网络错误。
     */
    sendMsgToGroup(groupsid: string, memberId: number, strdata:string): 'ok' | 'net error' | void
    /**
     * 发送数据给服务组内某成员
     * 给本服务组内某成员发送数据
     * @param groupsid 
     * @param strMemberId 
     * @param strdata 
     * @returns 返回” ok”表示发送成功，返回”net error”表示网络错误。
     */
    sendMsgToMember(groupsid: string, memberId: string, strdata: string): 'ok' | 'net error' | void

    /**
     * 设置微服务组心跳超时多久通知离线
     * 设置微服务组成员心跳超时多久通知为离线状态，并通知js服务端成员状态改变；此接口为api调用类型。
     * @param groupsid 表示服务组id号
     * @param unmsec 表示心跳超时时间，毫秒(范围1000-66060*1000毫秒)
     * @param 0为成功，非0失败；
     */
    setMsHeartTimeoutOffline(groupsid: string, unmsec: number): number

    /**
     *  设置微服务组心跳超时多久通知离开
     * 设置微服务组成员心跳超时多久通知为离开状态，微服务管理将成员踢出房间，并通知js服务端
     * 返回值说明Uint32，0为成功，非0失败；
     * @param groupsid 表示服务组id号
     * @param unmsec 表示心跳超时时间，毫秒(范围1000-66060*1000毫秒)
     * @param 0为成功，非0失败；
     */
    setMsHeartTimeoutLeave(groupsid:string, unmsec:number): number

    /**
     * 
     * @param indvdata 输入哈希前的数据
     * @param len 指定哈希后的输出长度
     * @returns [number,DataView]
     * number 0为成功，其他值:参考define_error中的Database错误码说明
     * DataView 哈希后的数据
     */
    blake2s(indvdata: DataView, len: number): [number, DataView]

    /**
     * MD5
     * @param instr 输入计算md5的源数据
     */
    md5(instr: string): string
}

/**
 * 加密库zcrypto
 */
interface zcrypto {
    /**
     * 
     * @param publickey 公钥
     * @param msg 消息内容
     * @param msglen 消息长度
     * @param sign 签名信息
     * @returns 1成功，0失败。
     */
    verifySignature(publickey: ArrayBufferView, msg: ArrayBufferView, msglen: number, sign: ArrayBufferView): number

    /**
     * base58编码
     * @param indvdata 编码前的数据
     * @returns [number, string] 返回数组     
     * number, // 0为成功，其他值:参考define_error中的Database错误码说明。
     * string // 编码后的数据
     */
    base58Encode(indvdata: DataView): [number, string]

    /**
     * base58解码
     * @param strdata 解码前的数据
     * @returns
     * number, // 0为成功，其他值:参考define_error中的Database错误码说明。
     * string // 编码后的数据
     */
    base58Decode(strdata: string): [number, string]
}

/**
 * 数据库zkvdb
 */
interface zkvdb {
    /**
     * 
     * @param strkey 为字符串类型,自动会哈希得到20字节的key
     * @param strdmappid DMAPP的id号,十六进制字符
     * @param index DMAPP的数据库序号
     * @returns [number,DataView]
     * number 0为成功，其他值:参考define_error中的Database错误码说明。
     * DataView 查询到的数据
     */
    queryDmappDb(strkey: string, strdmappid: string, index: number): [number, DataView]

    /**
     * 
     * @param strkey 为字符串类型,自动会哈希得到20字节的key
     * @param strdmappid DMAPP的id号,十六进制字符
     * @param index DMAPP的数据库序号
     * @param dvdata 数据
     * @returns // 0为成功，其他值:参考define_error中的Database错误码说明。
     */
    insertDmappDb(strkey: string, strdmappid: string, index: number, dvdata: DataView): number

    /**
     * 修改DMAPP数据库
     * @param strkey 为字符串类型,自动会哈希得到20字节的key
     * @param strdmappid DMAPP的id号,十六进制字符
     * @param index DMAPP的数据库序号
     * @param dvdata 数据
     * @returns 0为成功，其他值:参考define_error中的Database错误码说明。
     */
    modifyDmappDb(strkey:string, strdmappid:string, index:number, dvdata:DataView): number

    /**
     * 删除DMAPP数据库 
     * @param strkey 为字符串类型,自动会哈希得到20字节的key
     * @param strdmappid DMAPP的id号,十六进制字符
     * @param index DMAPP的数据库序号
     * @returns 0为成功，其他值:参考define_error中的Database错误码说明。
     */
    deleteDmappDb(strkey:string, strdmappid:string, index:number): number
}

interface zbase {
    /**
     * 打印日志
     * @param strLog 日志内容
     * @returns  0为成功，其他值:参考define_error中的Database错误码说明。
     */
    log(strLog: string): number

    /**
     * DataView转十六进制字符串
     * @param indvdata 
     * @returns  十六进制字符串
     */
    dataViewToHexStr(indvdata: DataView): string

    /**
     * 十六进制字符串转DataView
     * @param instr 输入十六进制字符串
     */
    hexStrToDataView(instr: string): DataView

    /**
     * 字符串转DataView 8
     * @param instr 输入原字符串
     * @returns  DataView类型的数据
     */
    strToDataView8(instr: string): DataView

    /**
     * DataView 数据转string
     * @param indvdata 输入DataView类型的数据
     * @returns string 原字符串
     */
    dataView8ToStr(indvdata: DataView):string

    /**
     * string to DataView 16
     * @param instr 输入原字符串
     * @returns DataView 类型的数据
     */
    strToDataView16(instr: string): DataView

    /**
     * DataView 转字符串
     * @param indvdata 输入DataView类型的数据
     * @returns 原字符
     */
    dataView16ToStr(indvdata: DataView): string
}

interface zrdb {
    /**
     * 数据库连接
     * @param strDmappid DMAPP的id号,十六进制字符
     * @param strUser 用户名
     * @param strPasswd 密码
     * @param strDbname 数据库名
     * @returns [number,bigint]
     * number 0为成功，其他值:参考define_error中的Database错误码说明。
     * bigint 数据会话id/连接id
     */
    connect(strDmappid:string, strUser:string, strPasswd:string, strDbname:string): [number, bigint]

    /**
     * 数据库执行sql
     * @param sessionid 数据库连接返回的会话id/连接id
     * @param strSql 查询返回的输出结果
     * @returns [number,string]
     * number 为成功，其他值:参考define_error中的Database错误码说明
     * string 
     */
    exec(sessionid: bigint, strSql: string): [number, string]

    /**
     * 数据库连接关闭
     * @param sessionid 数据库连接返回的会话id/连接id
     * @returns number 0为成功，其他值:参考define_error中的Database错误码说明。
     */
    disconnect(sessionid: bigint): number
}

declare namespace my {
    function hello();
}