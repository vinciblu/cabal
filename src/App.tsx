import React, { useState, useEffect } from 'react';
import BigNumber from "bignumber.js";
import { BocInfo } from './BocInfo';
import { BocExample } from './BocExample';
import { parseQuery, parseBoc } from './utils';
import { estimateBoc, publishBoc } from './api';
import { Address } from 'ton';
import BN from "bn.js";
import base64url from "base64url";
import { extractComment } from './comment-reader';

const API_KEY = 'AGS4VKEY6NZAONIAAAADFN2UTFBAPSSKRNHYR63OKKGYCVUBJEFI3RVXRPQ6MHVH5VGWFHA';

export type boc = {
    destination: string;
    wallet: string;
    amount: number;
    flags: string;
    refLen: number;
    bocData: any;
    body?: any;
    stateInit?: any;
    bodyCell?: any;
    rawData?: any;
    init?: any;
    bounce?: boolean;
    seqno: number;
    msgSeqno: number;
    validUntil: number;
    subWalletId: number;
    comment: string;
};

function App() {
    const initialBoc = {
        destination: 'x',
        wallet: '',
        amount: '-1',
        flags: '0x',
        refLen: -1,
        bocData: new Uint8Array(0),
        body: '',
        rawData: undefined,
    } as any;

    const [boc, setBoc] = useState(initialBoc);
    const [bocName, setBocName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mempoolBoc, setMempoolBoc] = useState<string>('');

    useEffect(() => {
        let params = parseQuery(window.location.search) as any;
        let bocParam = params.boc || window.location.hash.replace("#", "");
        if (bocParam) {
            bocParam = base64url.toBase64(bocParam);
            loadBocFromStr(bocParam);
        }
    }, []);

    async function loadBocFromStr(bocStr: string) {
        try {
            setBoc(initialBoc);
            console.log('Loading BOC from string:', bocStr);

            let bocData = await parseBoc(bocStr);
            bocData.value = bocData.value || new BN('0');

            const wallet = (bocData.from as Address).toFriendly();
            const dest = (bocData.to as Address).toFriendly();
            console.log('Parsed BOC data:', bocData);

            setBoc({
                rawData: bocStr,
                ...bocData,
                wallet: wallet,
                destination: dest,
                amount: new BigNumber(bocData.value.toString(10)).div(1e9).toFormat(4),
                body: bocData?.body?.toString() || '',
                stateInit: bocData.init,
                bodyCell: bocData?.body,
                comment: extractComment(bocData?.body),
            });
        } catch (error: any) {
            console.error('Error loading BOC from string:', error);
            setError(`Error loading BOC from string: ${error.message}`);
        }
    }

    async function fetchBOCFromMempool() {
        setIsLoading(true);
        setError('');
        try {
            console.log('Connecting to TonAPI mempool...');
            const response = await fetch('https://tonapi.io/v2/sse/mempool', {
                headers: { Authorization: `Bearer ${API_KEY}` },
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('Failed to get reader from response');
            }
    
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                
                const chunk = new TextDecoder().decode(value);
                console.log('Received chunk:', chunk);
                
                const lines = chunk.split('\n');
                
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const jsonData = JSON.parse(line.slice(6));
                            if (jsonData.boc) {
                                console.log('BOC String:', jsonData.boc);
                                setMempoolBoc(jsonData.boc);
                                await loadBocFromStr(jsonData.boc);
                                reader.cancel();
                                return;
                            }
                        } catch (err) {
                            console.error('Error processing message:', err);
                        }
                    }
                }
            }
        } catch (error: any) {
            console.error('Error fetching BOC from mempool:', error.message);
            setError(`Error fetching BOC from mempool: ${error.message}. Please check your network connection and API key.`);
        } finally {
            setIsLoading(false);
        }
    }

    const bocData = boc.wallet ? (
        <BocInfo
            boc={boc}
            bocName={bocName}
            onClear={() => { setBoc(initialBoc); }}
            estimateBoc={estimateBoc}
            publishBoc={publishBoc}
        />
    ) : (
        <div>
            <span className='p-10'>{error}</span>
        </div>
    );

    return (
        <div className="App" style={{ padding: '20px' }}>
            <div className='title' style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>B💎C Parser</div>
            <div className='title-h2' style={{ fontSize: '18px', marginBottom: '20px' }}>🔍 Parse | 🖥 Emulate | 🚀 Deploy | 📷 Share </div>
            <button
                onClick={fetchBOCFromMempool}
                style={{ 
                    padding: '15px 30px', 
                    margin: '0 20px 20px 0', 
                    backgroundColor: 'blue', 
                    color: 'white',
                    fontSize: '16px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
                disabled={isLoading}
            >
                {isLoading ? 'Fetching...' : 'Fetch BOC from Mempool'}
            </button>
            {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}
            {mempoolBoc && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Fetched BOC:</h3>
                    <pre style={{ 
                        backgroundColor: '#f0f0f0', 
                        padding: '15px', 
                        borderRadius: '5px', 
                        overflowX: 'auto' 
                    }}>
                        {mempoolBoc}
                    </pre>
                </div>
            )}
            <div className="app-main">
                <BocExample
                    parseBoc={(str: string) => { loadBocFromStr(str); }}
                    setName={(name: string) => { setBocName(name); }}
                />
                {bocData}
            </div>
        </div>
    );
}

export default App;