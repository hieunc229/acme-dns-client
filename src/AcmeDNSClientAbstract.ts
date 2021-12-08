
export abstract class AcmeDNSClientAbstract {
    abstract createRecord<T = any>(options: {
        name: string,
        type: string,
        value: string,
        domain: string,
        challenge: any,
        token: string,
        [prop: string]: any
    }): Promise<T>

    abstract removeRecord<T = any>(options: { domain: string, dnsRecord: any, token: string }): Promise<T>
}