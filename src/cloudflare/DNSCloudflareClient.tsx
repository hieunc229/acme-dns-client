

import fetch, { HeaderInit } from "node-fetch"
import { AcmeDNSClientAbstract } from "../AcmeDNSClientAbstract"


export default class DNSCloudflareClient extends AcmeDNSClientAbstract {

    /**
     * Get Cloudflare token.
     * To generate a token, login to Cloudflare Dashboard, navigate to "My profile -> API Token"
     * @param domain 
     * @returns 
     */
    // Get token from "My profile -> API Token"
    private getToken = (domain: string) => {
        return process.env[`ACME_EXPRESS_CLOUDFLARE_TOKEN_${domain}`] || process.env.ACME_EXPRESS_CLOUDFLARE_TOKEN
    }

    private getZoneId = (domain: string) => {
        return process.env[`ACME_EXPRESS_CLOUDFLARE_ZONE_ID_${domain}`] || process.env.ACME_EXPRESS_CLOUDFLARE_ZONE_ID
    }

    private handleCreateOutput = (input: any) =>{
        return input.result;
    }

    createRecord<T = CreateDNSRecordResponse>(options: {
        name: string,
        type: "TXT" | "A" | "CNAME",
        value: string,
        domain: string,
        challenge: any,
        token: string,
        [prop: string]: any
    }): Promise<T> {

        let { type, name, value, ttl = 1 } = options;

        const data = {
            type, name, ttl,
            content: value
        }

        let zoneId = this.getZoneId(options.domain);

        return this.r<T>(`zones/${zoneId}/dns_records`,
            { domain: options.domain, handleOutput: this.handleCreateOutput },
            { method: 'POST', data }
        )
    }

    removeRecord<T = DeleteDNSRecordResponse>(options: { domain: string, dnsRecord: any, token: string }): Promise<T> {

        let zoneId = this.getZoneId(options.domain);

        return this.r<T>(`zones/${zoneId}/dns_records/${options.dnsRecord.id}`,
            { domain: options.domain },
            { method: 'DELETE' }
        )
    }

    private r<T = any>(path: string, options: { domain: string, handleOutput?: (input: any) => any }, init?: { method: string, data?: any, headers?: HeaderInit }): Promise<T> {

        const { data, method = "GET" } = init || {};
        const { handleOutput, domain } = options;
        const token = this.getToken(domain);
        const url = `https://api.cloudflare.com/client/v4/${path}`;

        return new Promise((resolve, reject) => {

            function handleResolve(res: CloudflareResponse) {

                if (!res.success) {
                    reject((res.error || res.messages || ["failed"]).join(". "))
                }

                let output: any = res;
                if (handleOutput) {
                    output = handleOutput(res)
                }
                resolve(output);
            }

            fetch(url, {
                method,
                body: data ? JSON.stringify(data) : "",
                headers: {
                    ...init?.headers,
                    "Authorization": `Bearer ${token}`
                }
            })
                .then(rs => rs.json())
                .then(handleResolve)
                .catch(reject)
        })

    }

}

type DeleteDNSRecordResponse = {
    result: { id: string }
}

type CloudflareResponse = {
    result: any,
    success: boolean,
    error: { code: number, message: string}[],
    "messages": any[],
}

type CreateDNSRecordResponse = {
    "success": boolean,
    "errors": any[],
    "messages": any[],
    "result": CloudFlareDNSRecord
}

type CloudFlareDNSRecord = {
    "id": string,
    "type": string,
    "name": string,
    "content": string,
    "proxiable": boolean,
    "proxied": boolean,
    "ttl": number,
    "locked": boolean,
    "zone_id": string,
    "zone_name": string,
    "created_on": string,
    "modified_on": string,
    "data": any,
    "meta": {
        "auto_added": boolean,
        "source": string,
    }
}