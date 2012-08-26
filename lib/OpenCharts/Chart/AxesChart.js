/**
 * @requires OpenCharts/BaseTypes/Class.js
 * @requires OpenCharts/BaseTypes/Point.js
 * @requires OpenCharts/BaseTypes/Rect.js
 * @requires OpenCharts/TextStyle.js
 *@requires OpenCharts/Style.js
 * @requires OpenCharts/Item.js
 * @requires OpenCharts/RenderEnginer.js
 * @requires OpenCharts/Charts.js
 */

OpenCharts.Chart.AxesChart = OpenCharts.Class(OpenCharts.Chart,{
    coordinateStyle:null,
    nXRange:null,
    axesHeight:null,
    nYRange:null,
    nYStepNumber:null,
    stepYValue:null,

    initialize: function (div, options){
        OpenCharts.Chart.prototype.initialize.apply(this,
            arguments);

        var me = this;
        me.coordinateStyle = new OpenCharts.Coordinate();
    },

    renderAxes:function(){
        var me = this;
        if(me.coordinateStyle.bShowAxes && me.itemArray != null)
        {
            var nXRange = me.nXRange;
            var height =  me.axesHeight;
            var nYRange = me.nYRange;
            var nYStepNumber = me.nYStepNumber;

            //XY轴绘制
            me.myContext.strokeStyle = me.coordinateStyle.axesStyle.strokeStyle;
            me.myContext.lineWidth = me.coordinateStyle.axesStyle.lineWidth;
            //me.myContext.beginPath();
            me.myContext.moveTo(nXRange,me.coordinateStyle.headRange );
            me.myContext.lineTo(nXRange,me.height-me.coordinateStyle.footerRange);
            me.myContext.lineTo(me.width - nXRange,me.height-me.coordinateStyle.footerRange);
            me.myContext.stroke();
            //me.myContext.closePath();

            {
                me.myContext.save();
                me.myContext.lineWidth = 1;
                me.myContext.strokeStyle  = "#dbe1e1";
                me.myContext.globalCompositeOperation = "destination-over";

                //X刻度绘制
                if(me.coordinateStyle.bShowXAxesGrid)
                {
                    for(var i=1;i<me.itemArray[0].length;i++)
                    {
                        me.myContext.beginPath();
                        me.myContext.moveTo(nXRange*(i+1),me.height-me.coordinateStyle.footerRange );
                        me.myContext.lineTo(nXRange*(i+1),me.coordinateStyle.headRange);
                        me.myContext.stroke();
                        me.myContext.closePath();
                    }
                }

                if(me.coordinateStyle.bShowYAxesGrid)
                {
                    //Y刻度绘制
                    for(var j=1;j<nYStepNumber+1;j++)
                    {
                        me.myContext.beginPath();
                        me.myContext.moveTo(nXRange,me.height - me.coordinateStyle.footerRange - nYRange*j);
                        me.myContext.lineTo(me.width - nXRange,me.height - me.coordinateStyle.footerRange - nYRange*j);
                        me.myContext.stroke();
                        me.myContext.closePath();
                    }
                }

                me.myContext.restore();

            }


            //X刻度绘制
            for(var i=1;i<me.itemArray[0].length;i++)
            {
                me.myContext.beginPath();
                me.myContext.moveTo(nXRange*(i+1),me.height-me.coordinateStyle.footerRange );
                me.myContext.lineTo(nXRange*(i+1),me.height-me.coordinateStyle.footerRange-me.coordinateStyle.scaleLength*(i%2==0?2:1));
                me.myContext.stroke();
                me.myContext.closePath();
            }

            //Y刻度绘制
            for(var j=1;j<nYStepNumber+1;j++)
            {
                me.myContext.beginPath();
                me.myContext.moveTo(nXRange,me.height - me.coordinateStyle.footerRange - nYRange*j);
                me.myContext.lineTo(nXRange+me.coordinateStyle.scaleLength*(j%2==0?2:1),me.height - me.coordinateStyle.footerRange - nYRange*j);
                me.myContext.stroke();
                me.myContext.closePath();
            }



            //Text Prepare to Draw
            me.myContext.font = me.coordinateStyle.axesTextStyle.fStyle + " " + me.coordinateStyle.axesTextStyle.fWeight + " " +
                me.coordinateStyle.axesTextStyle.fSize + " " + me.coordinateStyle.axesTextStyle.fFamily;
            me.myContext.fillStyle = me.coordinateStyle.axesTextStyle.fColor;
            me.myContext.textAlign = me.coordinateStyle.axesTextStyle.fTextAlign;
            //X轴文字
            if(me.coordinateStyle.bShowXAxesText)
            {
                if(me.coordinateStyle.axesTextStyle.bFillText)
                {
                    for(var i=0;i<me.itemArray[0].length;i++)
                    {
                        me.myContext.fillText(me.itemArray[0][i].strCaption,nXRange*(i+1),me.height-me.coordinateStyle.footerRange+15 );
                    }

                }
                else
                {
                    for(var i=0;i<me.itemArray[0].length;i++)
                    {
                        me.myContext.strokeText(me.itemArray[0][i].strCaption,nXRange*(i+1),me.height-me.coordinateStyle.footerRange+me.coordinateStyle.axesTextStyle.fSize);
                    }
                }
            }

            //Y轴文字
            if(me.coordinateStyle.bShowYAxesText)
            {
                var stepYValue = Math.ceil(me.getMaxValue()/nYStepNumber);
                me.myContext.textAlign = "right";
                if(me.coordinateStyle.axesTextStyle.bFillText)
                {
                    for(var j=0;j<nYStepNumber+1;j++)
                    {
                        me.myContext.fillText(stepYValue*j,nXRange*0.9,me.height-me.coordinateStyle.footerRange-nYRange*j );
                    }

                }
                else
                {
                    for(var j=0;j<nYStepNumber+1;j++)
                    {
                        me.myContext.strokeText(stepYValue*j,nXRange*0.9,me.height-me.coordinateStyle.footerRange-nYRange*j );
                    }
                }
            }
        }
    },

    calculateValue:function(){
        var me = this;
        me.nXRange = me.width/(me.itemArray[0].length+1);
        me.axesHeight =  me.height - me.coordinateStyle.headRange - me.coordinateStyle.footerRange;
        me.nYRange = me.coordinateStyle.stepRange;

        if( me.nYRange == -1){
            me.nYRange =me.axesHeight / me.coordinateStyle.stepNumber;
            me.nYStepNumber = me.coordinateStyle.stepNumber;
        }else
        {
            me.nYStepNumber = me.axesHeight / me.nYRange;
        }
        me.stepYValue = Math.ceil(me.getMaxValue()/me.nYStepNumber);
    },

    getItemByPosition:function(pointX,pointY,selectType){
        var me = this;
        var bXInRange = pointX>=me.nXRange && pointX<=(me.width-me.nXRange);
        var bYInRange = pointY>=me.coordinateStyle.headRange && pointY<=(me.height-me.coordinateStyle.footerRange);
        if(!bXInRange || !bYInRange)
            return null;

        var nType = "Area1";
        if(selectType != undefined)
            nType = selectType;
        var x = Math.round(pointX / me.nXRange) - 1;
        var itemSelectedArray = [];
        for(var i=0;i<me.itemArray.length;i++)
        {
            var Y = me.height - (me.itemArray[i][x].data / me.stepYValue * me.nYRange) -  me.coordinateStyle.footerRange;
            if(nType == "Area")
            {
                itemSelectedArray.push({strCaption : me.itemArray[i][x].strCaption,data : me.itemArray[i][x].data,positionX:(x+1)*me.nXRange,positionY:Y});
            }
            else
            {
                if(Math.abs(Y-pointY)<5 && Math.abs((x+1)*me.nXRange-pointX)<5)
                {
                    itemSelectedArray.push({strCaption : me.itemArray[i][x].strCaption,data : me.itemArray[i][x].data,positionX:(x+1)*me.nXRange,positionY:Y});
                }
            }
        }
        return itemSelectedArray;
    },

    CLASS_NAME: "OpenCharts.Chart.AxesChart"
});