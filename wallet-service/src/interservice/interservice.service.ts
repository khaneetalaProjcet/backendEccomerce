import { Body, Injectable } from '@nestjs/common';

import fetch from 'node-fetch';

@Injectable()
export class InterserviceService {
  /**
   * this module is for get order from product service
   * @param id
   * @returns
   */
  async getOrder(id: string) {
    try {
      let rawResponse = await fetch(
        `http://localhost:9014/order/internal/findone/${id}`,
        {
          method: 'GET',
        },
      );
      console.log('requests results from product >>>>', rawResponse);
      if (!rawResponse) {
        return 0; // no connection exist
      }
      let response = await rawResponse.json();

      // console.log("order",response.order);
      console.log('response', response.data);

      if (!response) {
        return 0; // no connection exist
      }
      if (response.success) {
        return response.data;
      } else if (response.message == 'notFound') {
        return 'orderNotFound';
      } else if (response.message == 'internalError') {
        return 'productError';
      } else {
        return 'unknown';
      }
    } catch (error) {
      console.log('error occured in getting order >>>> ', error);
      return 0;
    }
  }

  /**
   * this module is for update order after completing order
   * @param orderId
   * @param invoice
   * @param status
   * @returns
   */
  async updateorder(orderId: string, invoice: any, status: number) {
    try {
      let rawResponse = await fetch(
        `http://localhost:9014/order/internal/update/${orderId}/${status}`,
        {
          method: 'POST',
          body: JSON.stringify(invoice),
        },
      );
      let response = await rawResponse.json();
      if (!response) {
        return 0;
      }
      return response.code
      
    } catch (error) {
      console.log('error occured in updating order >>>> ', error);
      return { success: false };
    }
  }

  /**
   * this module is for update khanetala goldBox of user after completing behPardakht gateway
   * @param invoice
   * @returns
   */
  async updateGoldBox(invoice: any) {
    try {
      let rawResponse = await fetch(
        'https://gateway.khanetala.ir/v1/trade/internal/goldBox/update',
        {
          method: 'POST',
          body: JSON.stringify(invoice),
        },
      );

      let response = await rawResponse.json();

      if (!response) {
        return 3;
      }
      return response.code;
    } catch (error) {
      console.log('error occured while trying to update goldBox in khanetala');
      return { success: false };
    }
    }
    
}





export class htmlPage {
  async successPage(backUrl: string) {
    return `
      <!DOCTYPE html>
<html lang="fa" dir="rtl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet"
        type="text/css" />
    <title>خانه طلا | نتیجه پرداخت</title>
</head>

<body>
    <main class="layout">
        <div>
            <div class="d-flex">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="96px" height="96px">
                    <path fill="#4caf50"
                        d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z" />
                    <path fill="#ccff90"
                        d="M34.602,14.602L21,28.199l-5.602-5.598l-2.797,2.797L21,33.801l16.398-16.402L34.602,14.602z" />
                </svg>
            </div>
            <div class="my-8">
                <p class="payment-text">پرداخت شما <span class="text-red">موفق</span> بوده است</p>
            </div>
            <div>
                <a href=${backUrl} class="mt-2 back-link">بازگشت به صفحه اصلی</a>
            </div>
        </div>
    </main>
</body>

</html>

<style>
    .layout {
        height: 90vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-family: 'vazirmatn';
    }

    .layout>div {
        background-color: rgba(254, 253, 251, 1);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
    }

    .layout .content {
        margin: 2rem 0;
        box-shadow: 4px 4px 12px 0px rgba(212, 205, 191, 0.4);
        backdrop-filter: blur(12px);
        padding: 48px;
        min-width: 90%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    @media (min-width: 768px) {
        .layout .content {
            min-width: 50%;
        }
    }

    .payment-image {
        max-width: 100%;
        height: auto;
    }

    .payment-text {
        font-size: 20px;
        margin: 4rem 0;
    }

    .back-link {
        margin-top: 2rem;
        text-decoration: none;
        width: 5rem;
        height: 2rem;
        padding: 0.5rem 1rem;
        background-color: #876824;
        color: #fff;
        border-radius: 8px;
    }

    .back-link:hover {
        background-color: #977939;
        color: #fff;
    }

    .back-link:active {
        background-color: #ab9056;
        color: #fff;
    }
</style>
    `;
  }

  async failedPage(backUrl: string, reason: string) {
    return `
    <!DOCTYPE html>
<html lang="fa" dir="rtl">
  
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet"
        type="text/css" />
    <title>خانه طلا | نتیجه پرداخت</title>
</head>

<body>
    <main class="layout">
        <div>
            <div class="d-flex">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="96px" height="96px">
                    <linearGradient id="hbE9Evnj3wAjjA2RX0We2a" x1="7.534" x2="27.557" y1="7.534" y2="27.557"
                        gradientUnits="userSpaceOnUse">
                        <stop offset="0" stop-color="#f44f5a" />
                        <stop offset=".443" stop-color="#ee3d4a" />
                        <stop offset="1" stop-color="#e52030" />
                    </linearGradient>
                    <path fill="url(#hbE9Evnj3wAjjA2RX0We2a)"
                        d="M42.42,12.401c0.774-0.774,0.774-2.028,0-2.802L38.401,5.58c-0.774-0.774-2.028-0.774-2.802,0	L24,17.179L12.401,5.58c-0.774-0.774-2.028-0.774-2.802,0L5.58,9.599c-0.774,0.774-0.774,2.028,0,2.802L17.179,24L5.58,35.599	c-0.774,0.774-0.774,2.028,0,2.802l4.019,4.019c0.774,0.774,2.028,0.774,2.802,0L42.42,12.401z" />
                    <linearGradient id="hbE9Evnj3wAjjA2RX0We2b" x1="27.373" x2="40.507" y1="27.373" y2="40.507"
                        gradientUnits="userSpaceOnUse">
                        <stop offset="0" stop-color="#a8142e" />
                        <stop offset=".179" stop-color="#ba1632" />
                        <stop offset=".243" stop-color="#c21734" />
                    </linearGradient>
                    <path fill="url(#hbE9Evnj3wAjjA2RX0We2b)"
                        d="M24,30.821L35.599,42.42c0.774,0.774,2.028,0.774,2.802,0l4.019-4.019	c0.774-0.774,0.774-2.028,0-2.802L30.821,24L24,30.821z" />
                </svg>

            </div>
            <div class="my-8">
                <p class="payment-text">${reason}</p>
            </div>
            <div>
                <a href=${backUrl} class="mt-2 back-link">بازگشت به صفحه اصلی</a>
            </div>
        </div>
    </main>

    </body>

</html>

<style>
    .layout {
        height: 90vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-family: 'vazirmatn';
    }

    .layout>div {
        background-color: rgba(254, 253, 251, 1);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
    }

    .layout .content {
        margin: 2rem 0;
        box-shadow: 4px 4px 12px 0px rgba(212, 205, 191, 0.4);
        backdrop-filter: blur(12px);
        padding: 48px;
        min-width: 90%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    @media (min-width: 768px) {
        .layout .content {
            min-width: 50%;
        }
    }

    .payment-image {
        max-width: 100%;
        height: auto;
    }

    .payment-text {
        font-size: 20px;
        margin: 4rem 0;
    }

    .back-link {
        margin-top: 2rem;
        text-decoration: none;
        width: 5rem;
        height: 2rem;
        padding: 0.5rem 1rem;
        background-color: #876824;
        color: #fff;
        border-radius: 8px;
    }

    .back-link:hover {
        background-color: #977939;
        color: #fff;
    }

    .back-link:active {
        background-color: #ab9056;
        color: #fff;
    }
</style>
    `;
  }
}
