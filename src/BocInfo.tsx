import {  useState } from 'react';
import { Address, RawStateInit } from 'ton';
import { boc } from './App';
import { BocResult } from './BocResult';
import BN from "bn.js";
import { ShareQrCode } from './ShareQrCode';
import { u8ToBase64Str } from './utils';
import { TonClient } from "ton";
import { BocBody } from './BocBody';
import { AddressAvatar } from './AddressAvatar';
import base64url from "base64url"

type BocResult = {
    
}



export const BocInfo = (props: {boc: boc, bocName:string, onClear: any, estimateBoc: any, publishBoc: any}) => {
    const { boc, onClear, estimateBoc, bocName, publishBoc } = props;

    const [results, setResults] = useState({} as BocResult);
    const [isLoading, setIsLoading] = useState(false);
    const [sendBocRes, setSendBocRes] = useState("");
    const [sendBocError, setSendBocError] = useState("");
    const [isPublishingBoc, setPublishingBoc] = useState(false);
    const [shareUrl, setShareUrl] = useState("");

    const [loadingTime, setLoadingTime] = useState("");
    const runBocEmulator = async () => {
        //@ts-ignore
        setIsLoading(true);
        let now = Date.now();
        let bocResultResponse = await estimateBoc(boc.rawData);
        setLoadingTime( `🚌 execution took ${((Date.now()- now) /1000).toFixed(2)}s` )
        setIsLoading(false);
        
        setResults(JSON.parse(bocResultResponse));
    }

    const publishBocClick = async () => {
        //@ts-ignore
        setPublishingBoc(true);
        
        if(ArrayBuffer.isView(boc.rawData)) {
            boc.rawData = u8ToBase64Str(boc.rawData);
        }
        try {
            let bocResultResponse = await publishBoc(boc.rawData);
            setPublishingBoc(false);
            console.log(bocResultResponse);
            setSendBocRes(bocResultResponse);
        } catch (e: any) {
            setSendBocError(e.message)
        }   
        
        
        
    }

    const shareClick =async () => {
        let base64 = u8ToBase64Str(boc.rawData);
        base64url.fromBase64(base64)
        let page = document.location.href.replace(document.location.hash,"");
        const url = `${page}/#${base64}`;
        console.log(url);
        
        setShareUrl(url)
    }
    
    const stateInit = boc.init ? (<>
        <div className='mini-title'>Message State Init: </div>
        <div className="mini-header">Code</div>
        <pre className='pre-body'>Code:{boc.init?.code.toString()}</pre>
        <div className="mini-header">Data</div>
        <pre className='pre-body'>Data:{boc.init?.data.toString()}</pre>
    </>) : null;
    
    //@ts-ignore
    let externalStateInit;
    try {
        externalStateInit = (<div>
            <div className="mini-header">External State Init</div>
            <pre className='pre-body'>{(boc.stateInit as RawStateInit).code?.toString()}</pre>
        </div>)
    } catch (e) {
        console.log(e);
        
    }

    let sendBocResEl = null;
    if (sendBocRes) {
        let isOk = sendBocRes.indexOf('{"ok":true') > -1;
        sendBocResEl = <div className={'boc-res-success ' + (isOk ? 'boc-res-ok' : '')}>{sendBocRes}</div>
    }

    if (sendBocError) {
        sendBocResEl = <div className='boc-res-error'>{sendBocError}</div>
    }

    let buttonClass = (isLoading ? `is-loading` : ``) + ` button is-info`;
    

    console.log();
    
    return (
        <div>
            <div className='title'>{bocName}</div>
            <div>
                <div className='mini-title'>Source Wallet: </div>
                <div ><AddressAvatar address={boc.wallet} size={32} />
                    <a className='addr' target={"_blank"} href={`http://tonviewer.com/${boc.wallet}`}>{boc.wallet}</a>
                </div>
            </div>
            <div>
                <div className='mini-title'>Destination Address: </div>
                <div ><AddressAvatar address={boc.destination} size={32} />
                    <a className='addr'  target={"_blank"} href={`http://tonviewer.com/${boc.destination}`}>{boc.destination}</a>
                </div>
                
            </div>
            <div>
                <div className={'mini-title ' + (boc.msgSeqno == boc.seqno ? '': 'error-icon-seqno')}>Wallet Seqno: <b>{boc.seqno}</b> == Boc Seqno: <b>{boc.msgSeqno}</b></div>
                <div className={'mini-title ' + (boc.validUntil - Date.now() / 1000 > 0 ? '' : 'error-icon-expired')}><b>Valid Until:</b> {new Date(boc.validUntil * 1000).toISOString()}</div>
            </div>
            <div>
                <div className='mini-title'><b>SubWalletId:</b> {boc.subWalletId} </div>
            </div>
            <div>
                <div className='mini-title'>Transfer Amount: </div>
                <div className='addr'>{boc.amount} TON 💎</div>
            </div>
                <div>
                    <div className='mini-title'>Internal Flags: </div>
                <div className='addr'>Bounce: {`${boc.bounce}`}</div>
            </div>
            <div>
                {externalStateInit}
                <div>Body</div>
                <pre className='pre-body'>
                    <BocBody body={boc.bodyCell} comment={boc.comment}></BocBody>
                </pre>
                {boc.comment ? null : <pre className='pre-body'>{boc.body?.toString()}</pre>}
            </div>
            <div>{stateInit}</div>
            <br />
            {sendBocResEl}

            <button className='button ' onClick={onClear}>❌ Clear</button>
            <span className='p-10'></span>
            <button className={buttonClass} onClick={runBocEmulator}>🎬 Estimate BOC</button>
            <span className='p-10'></span>
            <button className={`button is-primary ${isPublishingBoc ? 'is-loading' : ''}`} onClick={publishBocClick}>🚀 Publish BOC</button>
            <span className='p-10'></span>
            <button className={`button is-success }`} onClick={shareClick}>📷 Share Boc</button>
            <br></br>
            <BocResult messageList={results} loadingTime={loadingTime} />
            <ShareQrCode shareUrl={shareUrl} />
        </div>
        )
    };
    