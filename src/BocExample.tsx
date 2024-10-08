import { useState } from "react";

const BOC_WITH_STATE_INIT = 'te6cckECAwEAAQ8AAt+IAbcaWXVUguqdxz4NjDzLseJCFvWPlUckZQ7AwWRqvm78EZ50PcvxScy9x3qXO+Do6kpHnnPlEFZiHF4DuyhYcUGUaIiiRsTdjDmm+SSmb2czzydjnagg0zLnNeWmUh1KyAClNTRi/////+AAAAAQAQIA3v8AIN0gggFMl7ohggEznLqxn3Gw7UTQ0x/THzHXC//jBOCk8mCDCNcYINMf0x/TH/gjE7vyY+1E0NMf0x/T/9FRMrryoVFEuvKiBPkBVBBV+RDyo/gAkyDXSpbTB9QC+wDo0QGkyMsfyx/L/8ntVABQAAAAACmpoxcnJTZWfAxBC0SpxXMaIHJbrgfb9No7xJuHNDXaluLadzgetvk=';
const BOC_REGULAR_TX = 'te6cckEBAgEAqQAB34gBtxpZdVSC6p3HPg2MPMux4kIW9Y+VRyRlDsDBZGq+bvwBGJ82qnbjKmXg2u8Of75PNExfAShOBw8CeFHsqAlP364VGB5bEmZyQllIAE3YESvKWOB22QsEC2NFl1AU9FuQWU1NGLsZbKaYAAAACBwBAGhiAHXG0W1CXIYD9CYFNJmdkDcOTrv6yoxMePd0iiCVO26WIBfXhAAAAAAAAAAAAAAAAAAA3/KpOA==';

const SWAP_TON_JETTON =
    "te6cckEBAgEAvwAB34gBxw5akQfJaXlBLYO7rsolHBjY6Ik5Q1Lb9shmS/UwX+QHWFrwTABHCdMlIIRLpZbyRs1h5v/mhUOS+cAq3kR2vT+jhNDvpZxGuQcPveMm5XyHFlZXc/f+8tiIXn13NISwOU1NGLsa8z7QAAAMgBwBAJRiAG01gF4g3YBE6C155WD4bBwzVaPiwwux6+ELuGVQS1OdIh+YKAAAAAAAAAAAAAAAAAAAAAAAGQAAAAAAAAABQ7msoAXjF4cRtdX05xc=";

const SWAP_JETTON_TON_AND_REVERT =
    "te6ccgECCgEAArUAAvmIAbpSz41LTTHWPeUMhJoaV6CTQ4Yl2SqspZjcXVCxm0TaBVb9B9BBS9GkSD6/IGYCIWkdU8BXOo1Ne9F5nop7NkgX3rA6C+XAjRs/g6EKtFwIEKLPw4OxZdulq+CVh7zwyEAAAAE7NF3dqAAAQRgAAVpwtuTeCzRd3AAMDgEEAbNoAbpSz41LTTHWPeUMhJoaV6CTQ4Yl2SqspZjcXVCxm0TbADa4VOnTYlLvDJ0gZjNYm5PXfSmmtL6Vs6A/CZEtXCNIFM1PYDIABhAMXgAAVpwtuTeEzRd3AMACAXXqBhhdAAAAAAAAAABTMzD7cAgB3givFBxg1Z7hgOc4Nj2GWakCvoKlMMDD+B3bGNgSVLxzKDITybG4tAMAS2aLyYmAFEJ0lFcleV7i3npr2Sd5BkSHFknEw0vd8uVO4PO63GdhArVCAFEJ0lFcleV7i3npr2Sd5BkSHFknEw0vd8uVO4PO63GdoC+vCAAAAAAAAAAAAAAAAAACMAAAAe4AUwuAo/dBcF2VlwtMYB15Fbau80xnBRP+X4n69I6CyklABQYIQgJ5IKfXNZPQthJ9BEgcrNv4eWzfNmCV2z9v1rBw8nrY+wGbAAAAACmpoxf01ezxKopbsOCk1SUdC7ErhSmoZCOpvjy8Kyc4ICKiLYAbpSz41LTTHWPeUMhJoaV6CTQ4Yl2SqspZjcXVCxm0TaAAAAA8BwGPgAfICxdFBnBZ31EDHVOW7uVNuqtGCyxw2OnHDGIuuFcO0AN0pZ8alppjrHvKGQk0NK9BJocMS7JVWUsxuLqhYzaJtII8NGAYCAFP46DUgoAd4IrxQcYNWe4YDnODY9hlmpAr6CpTDAw/gd2xjYElS8EBQAkAS2aLyYmAG6Us+NS00x1j3lDISaGlegk0OGJdkqrKWY3F1QsZtE2h";

const SWAP_JETTON_TON =
    "te6cckECAwEAAQ4AAd+IAccOWpEHyWl5QS2Du67KJRwY2OiJOUNS2/bIZkv1MF/kAVaAjUug6ljUj5/qxmljCCqrJUnSxUiqlYkWDZZTvrRV1zwGUY8jWlkrGZDDO4/IKrMKt7cGLOGGpUG+vmfMqGFNTRi7GwUFCAAADNgcAQFoYgBeMcWFnmxCkcI0rBSUypr7zwNUePBnjIBseA8tnB1YEKBCwdgAAAAAAAAAAAAAAAAAAQIAww+KfqUAAAAAAAAAAVAdN347aAAS3pX3JJG8lvOUpFhNdCk5L+8hSBCFyDo1FJg1U63imQA44ctSIPktLyglsHd12USjgxsdEScoalt+2QzJfqYL/IgKupUAAAAAGEOvOjBI49Fy/w==";

const DEPLOY_JETTON = "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";

const SCALETON = "te6cckECBwEAAiQAAd+IAccOWpEHyWl5QS2Du67KJRwY2OiJOUNS2/bIZkv1MF/kANrbWlcv22ceE71WLzToWWkfnjRCKX6B8UppbE3Ke3xMLbvMw5CW/Vw4NGQbsqvgmSNnbeCzLewBeMedjRlfuGFNTRi7G8+bcAAADcgcAQFoYgBHngXBh2KHCxrhditmB7O6bcGw4Gdu8hU2LPVrocVF0CWWgvAAAAAAAAAAAAAAAAAAAQIBrxkiCphYDQ60CdwOkEdzWUAIAVIir1dJLq6bvThZLiy4aB1QtblvXd+Frvv8ZGM3vuaDADjhy1Ig+S0vKCWwd3XZRKODGx0RJyhqW37ZDMl+pgv8kL68IAMDAZdJKpgbgAasmelKYDZ6AHnl5HW2KSmLZuRXkZmDJHSp620RB/BN0AOOHLUiD5LS8oJbB3ddlEo4MbHREnKGpbftkMyX6mC/yQF9eEAgBAJf0zuweeAHHDlqRB8lpeUEtg7uuyiUcGNjoiTlDUtv2yGZL9TBf5KUE3zJ/yAvrwgEBQYAl+kWu++AHHDlqRB8lpeUEtg7uuyiUcGNjoiTlDUtv2yGZL9TBf5QA44ctSIPktLyglsHd12USjgxsdEScoalt+2QzJfqYL/JAJiWgCAAl6iXCtCAHHDlqRB8lpeUEtg7uuyiUcGNjoiTlDUtv2yGZL9TBf5QA44ctSIPktLyglsHd12USjgxsdEScoalt+2QzJfqYL/JAJiWgCDV3TpL";
const STONE = "te6cckECAwEAAS4AAd+IAccOWpEHyWl5QS2Du67KJRwY2OiJOUNS2/bIZkv1MF/kAvnDyewIdbg/sv09+c6HU+RHjW2xHELhCITg5l0chRDQmuGsCV/BVSXvVTCcmWyg9XeWZ2mdzgP/8DqIuCQqWGlNTRi7HGVl2AAADnAcAQHVYgApoCUT6thmuB4Xm9SXQfey5CM2UsFzsloGjmStITj+1SCPDRgAAAAAAAAAAAAAAAAAAA+KfqUAEPpyJSppCEO5rUMIAO87mQKicbKgHIk4pSPP4k5xhHqutqYgAB7USnesDnCcED39JAMCAJUlk4VhgALJ9dBBxH/f1PcJPvXABIoXxAfSRxyJdSoViW248MLh5jQ4oQA44ctSIPktLyglsHd12USjgxsdEScoalt+2QzJfqYL/JDKvqsF";

export const BocExample = ( props: {parseBoc: Function, setName: Function}) => {
    
    const [currentBoc, setExampleBoc] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);

    function onclick(data: any, name:string) {
        props.parseBoc(data);
        props.setName(name);
        setExampleBoc(data)
    }

    function classSelected(boc: string) {
        return currentBoc == boc ? "is-primary" : ""
    }
    function expandButton() {
        return (<>
            <div className="p-10"></div>    
            <div className="button is-small right" style={{float:"right"}} onClick={() => {  setIsExpanded(true) }}>Show Examples</div>
        </>)
    }

    if (!isExpanded) {
        return expandButton();
    }
    

    return (
        <div className="border-b p-10">
            <div>Boc Examples
                <button style={{ float: "right" }} onClick={() => setIsExpanded(false)}> ❌ </button>
            </div>
            <div onClick={onclick.bind(null, BOC_REGULAR_TX, 'boc empty')} className={"tag boc-button " + classSelected(BOC_REGULAR_TX) }>boc empty</div>
            {/* <div onClick={onclick.bind(null, BOC_WITH_STATE_INIT, 'boc boc')} className={"boc-button">b + }oc boc-state-init</div> */}
            <div onClick={onclick.bind(null, DEPLOY_JETTON, 'Deploy Jetton')} className={"tag boc-button "  + classSelected(DEPLOY_JETTON) }>Deploy Jetton </div>
            <div onClick={onclick.bind(null, SWAP_JETTON_TON, 'Swap ton')} className={"tag boc-button "   + classSelected(SWAP_JETTON_TON) }>Swap Jetton to Ton</div>
            <div onClick={onclick.bind(null, SWAP_TON_JETTON, 'Swap Jetton')} className={"tag boc-button " + classSelected(SWAP_TON_JETTON) }>Swap Ton to Jetton</div>
            <div onClick={onclick.bind(null, SWAP_JETTON_TON_AND_REVERT, 'Swap Jetton')} className={"tag boc-button " + classSelected(SWAP_JETTON_TON_AND_REVERT) }>Swap Jetton And Revert</div>
            <div onClick={onclick.bind(null, SCALETON, 'Swap Jetton')} className={"tag boc-button " + classSelected(SCALETON) }>Scale</div>
            <div onClick={onclick.bind(null, STONE, 'StonFi')} className={"tag boc-button " + classSelected(STONE)}>Ston.fi</div>
        </div>   )
}