

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

    createRecord<T = CreateDNSRecordResponse>(options: {
        name: string,
        type: "TXT" | "A" | "CNAME",
        value: string,
        domain: string,
        challenge: any,
        [prop: string]: any
    }): Promise<T> {

        let { type, name, value, ttl = 1 } = options;

        const data = {
            type, name, ttl,
            content: value
        }

        let zoneId = this.getZoneId(options.domain);

        return this.r<T>(`zones/${zoneId}/dns_records`,
            { domain: options.domain },
            { method: 'POST', data }
        )
    }

    removeRecord<T = DeleteDNSRecordResponse>(options: { domain: string, dnsRecord: any }): Promise<T> {

        let zoneId = this.getZoneId(options.domain);

        return this.r<T>(`zones/${zoneId}/dns_records/${options.dnsRecord.id}`,
            { domain: options.domain },
            { method: 'DELETE' }
        )
    }

    private r<T = any>(path: string, options: { domain: string }, init?: { method: string, data?: any, headers?: HeaderInit }): Promise<T> {

        const { data, method = "GET" } = init || {};

        return new Promise((resolve, reject) => {
            fetch(`https://api.cloudflare.com/client/v4/${path}`, {
                method,
                body: data ? JSON.stringify(data) : "",
                headers: {
                    ...init?.headers,
                    "Authorization": `Bearer ${this.getToken(options.domain)}`
                }
            })
                .then(rs => rs.json())
                .then(resolve)
                .catch(reject)
        })

    }

}

type DeleteDNSRecordResponse = {
    result: { id: string }
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