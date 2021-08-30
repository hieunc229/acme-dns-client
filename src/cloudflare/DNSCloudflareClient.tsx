import AcmeDNSClientAbstract from "../AcmeDNSClientAbstract";

import fetch, { HeaderInit } from "node-fetch"


export default class DNSCloudflareClient extends AcmeDNSClientAbstract {

    //https://github.com/cloudflare/node-cloudflare
    // Get token from "My profile -> API Token"
    private token = process.env.ACME_EXPRESS_CLOUDFLARE_TOKEN || ""

    //I t’s in the Overview tab for that domain. Right hand column in the API section. Scroll down a bit.
    private zoneId = process.env.ACME_EXPRESS_CLOUDFLARE_ZONE_ID || ""

    createRecord<T = CreateDNSRecordResponse>(name: string, type: "TXT" | "A" | "CNAME", value: string, ttl?: number): Promise<T> {

        const data = {
            type,
            name,
            content: value,
            ttl: ttl || 1 // 1 is "auto"
        }

        return this.r<T>(`zones/${this.zoneId}/dns_records`, {
            method: 'POST',
            data
        })
    }

    removeRecord<T = DeleteDNSRecordResponse>(dnsId: any): Promise<T> {
        return this.r<T>(`zones/${this.zoneId}/dns_records/${dnsId}`, {
            method: 'DELETE'
        })
    }

    private r<T = any>(path: string, init?: { method: string, data?: any, headers?: HeaderInit }): Promise<T> {

        const { data, method = "GET" } = init || {};

        return new Promise((resolve, reject) => {
            fetch(`https://api.cloudflare.com/client/v4/${path}`, {
                method,
                body: data ? JSON.stringify(data) : "",
                headers: {
                    ...init?.headers,
                    "Authorization": `Bearer ${this.token}`
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