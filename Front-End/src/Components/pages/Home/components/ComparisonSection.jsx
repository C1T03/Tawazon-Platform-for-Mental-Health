import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React from 'react';
import FalseIcon from '../../../ui/FalseIcon';
import TrueIcon from '../../../ui/TrueIcon';
import BalanceIcon from '../../../ui/BalanceIcon';
import styled from 'styled-components';
import TooltipComponent from './TooltipComponent';
const MyTableCellSecond = styled(TableCell)(() => ({
    backgroundColor: '#fff',
    width: '30%',
    textAlign: 'center'
}));

// تعريف MyTableCellSecond باستخدام styled-components
const MyTableCellThird = styled(TableCell)(() => ({
    width: '30%',
    textAlign: 'center'

}));
const MyTypography = styled(TableCell)(() => ({
    fontFamily: 'Dubai-Bold',
    fontSize: '1.2rem',
    border: 'none',
    color: '#fff'
}));



export default function ComparisonSection() {
    const data = [
        {
          que: "مساعدة أفضل في المكتب",
          inBalance: true,
          inOffice: true,
          description: "مقدمة من قبل معالج مؤهل يتمتع جميع المعالجين بالخبرة والمؤهلات ذات الصلة من منظماتهم المهنية المعنية"
        },
        {
          que: "الزيارات المكتبية",
          inBalance: false,
          inOffice: true,
          description: "التنقل إلى موقع المعالج، وقضاء بعض الوقت في غرفة الانتظار، والجلوس في مكتبه"
        },
        {
          que: "الرسائل في أي وقت",
          inBalance: true,
          inOffice: false,
          description: "أرسل واستقبل الرسائل إلى معالجك، دون الحاجة إلى جدولة!"
        },
        {
          que: "جلسات الدردشة",
          inBalance: true,
          inOffice: false,
          description: "محادثة في الوقت الفعلي عبر الرسائل الفورية"
        },
        {
          que: "جلسات الهاتف",
          inBalance: true,
          inOffice: false,
          description: "تحدث مع معالجك عبر الهاتف في وقت محدد"
        },
        {
          que: "جلسات الفيديو",
          inBalance: true,
          inOffice: false,
          description: "جلسة وجهاً لوجه مع المعالج الخاص بك عبر الفيديو في وقت محدد"
        },
        {
          que: "سهولة تبديل مقدمي الخدمة",
          inBalance: true,
          inOffice: false,
          description: "إذا كنت غير راضٍ عن معالجك، فانقر على زر واحصل على موفر آخر"
        },
        {
          que: "الوصول إلى العلاج من أي مكان",
          inBalance: true,
          inOffice: false,
          description: "باستخدام الهاتف أو الكمبيوتر، يمكنك التواصل مع معالجك في أي وقت ومن أي مكان"
        }
      ];
    return (
        
        <Container maxWidth='xl' sx={{background: 'url(./Images/SVG/backGround_2.svg)',backgroundRepeat:'no-repeat',backgroundSize: 'cover', padding: ' 250px 40px', borderRadius: '30px', marginTop: '40px'}}>
        <Typography variant='h4' sx={{width: '100%', textAlign: 'center', color: '#fff', fontFamily: 'Dubai-Bold', margin: '40px'}}>مساعدة أفضل مقابل العلاج التقليدي في العيادة</Typography>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell> </TableCell>
                            <TableCell sx={{backgroundColor: '#4faa84',  textAlign: 'center', borderTopLeftRadius: '10px',borderTopRightRadius: '10px'}}><BalanceIcon /></TableCell>
                            <MyTableCellThird><Typography fontFamily={'Dubai-Bold'} color='#fff'>في المكتب</Typography></MyTableCellThird>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data.map((item,index)=>
                            
                                <TableRow key={index}>
                                <TableCell><MyTypography>{item.que} <TooltipComponent title={item.description}/></MyTypography></TableCell>
                                <MyTableCellSecond>{item.inBalance? <TrueIcon />: <FalseIcon />}</MyTableCellSecond>
                                <MyTableCellThird>{item.inOffice? <TrueIcon />: <FalseIcon />}</MyTableCellThird>
                            </TableRow>
                            
                            )
                        }
                        
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}
