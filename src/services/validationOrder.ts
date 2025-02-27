export function ValidationOrder(newOrder){
          if(newOrder.situation == "خالص" || newOrder.situation == "غير خالص"){
            if(newOrder.advancedAmount !== null)
              return "تأكد من الحالة، مبلغ ديال تسبيق كيتستعمل غير فحالة التسبيق"
          }
          if(newOrder.situation == "تسبيق"){
            if(newOrder.price <= newOrder.advancedAmount)
              return "مبلغ التسبيق خاص اكون صغر من المبلغ الاجمالي، تأكد مرة أخرى"
          }
          let todayDate = new Date();
          todayDate.setHours(0, 0, 0, 0);
          if(newOrder.deliveryDate < todayDate){
            return "تاريخ ماشي صحيح تأكد مرة أخرى"
          }
          return "valide"
}