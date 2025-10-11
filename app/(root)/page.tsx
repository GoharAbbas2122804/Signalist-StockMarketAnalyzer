import Header from '@/components/Header'
import TradingViewWidget from '@/components/TradingViewWidget'
import { Button } from '@/components/ui/button'
import { HEATMAP_WIDGET_CONFIG, MARKET_DATA_WIDGET_CONFIG, MARKET_OVERVIEW_WIDGET_CONFIG, TOP_STORIES_WIDGET_CONFIG } from '@/lib/constants'
import React from 'react'

const page = () => {

  const  scriptUrl=`https://s3.tradingview.com/external-embedding/embed-widget-`;
  return (
    <div className='flex min-h-screen home-wrapper'>
      <section className="grid w-full gap-8 home-section">
        {/* Market over view chart 1 */}
        <div className="md:col-span-1 xl:col-span-1 ">
          <TradingViewWidget
            title='Market OverView'
            scriptUrl={`${scriptUrl}market-overview.js`}
            config={MARKET_OVERVIEW_WIDGET_CONFIG}
            className='custom-chart'
          />
        </div>
        {/* Stock heatmap chart 2 */}
        <div className='md:col-span-1 xl:col-span-2'>
          <TradingViewWidget
            title='Stcok HeatMap'
            scriptUrl={`${scriptUrl}stock-heatmap.js`}
            config={HEATMAP_WIDGET_CONFIG}
           
          />
        </div>
      </section>




      <section className="grid w-full gap-8 home-section">
        {/* Top stories chart 3 */}
        <div className="h-full md:col-span-1 xl:col-span-1 ">
          <TradingViewWidget
            scriptUrl={`${scriptUrl}timeline.js`}
            config={TOP_STORIES_WIDGET_CONFIG}
            
          />
        </div>
        <div className='h-full md:col-span-1 xl:col-span-2'>
          {/* Market quotes chart 4 */} 
          <TradingViewWidget
            scriptUrl={`${scriptUrl}market-quotes.js`}
            config={MARKET_DATA_WIDGET_CONFIG}
          
          />
        </div>
      </section> 




    </div>
  )
}

export default page