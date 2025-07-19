import React from 'react'
import HowToWork from './HowToWork'
import { Grid, Typography } from '@mui/material'

export default function PlatformGuide() {
  const mydata = [
  {
    title: 'أحصل على أفضل معالج لك',
    des: 'أجب عن بعض الأسئلة للعثور على معالج مؤهل يناسب احتياجاتك وتفضيلاتك. انضم إلى أكبر شبكة إلكترونية. لمقدمي الخدمات المعتمدين.',
    img: '/Images/PNG/Dc_2.png'
  },
  {
    title: 'تواصل بطريقتك',
    des: 'تحدث مع معالجك بالطريقة التي تناسبك -نصاً، دردشة، صوتاً، أو فيديو. توقع نفس الاحترافية التي يُحظى بها في العيادة.',
    img: '/Images/PNG/Dc_3.png'
  },
  {
    title: 'العلاج عندما تحتاج إليه',
    des: 'يمكنك مراسلة معالجك في أي وقت ومن أي مكان. كما يمكن جدولة جلسات مباشرة في أي الوقت الذي يناسبك، والاتصال من أي جهاز محمول أو كمبيوتر.',
    img: '/Images/PNG/Dc_4.png'
  }]
  return (
    <Grid container spacing={2} marginTop={10}>
      <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center'}}>
        <Typography variant='h3' fontFamily={'Dubai-Bold'}>
        كيفَ يعمل
        </Typography>
      </Grid>
      {mydata.map((item,index)=>
      <HowToWork title = {item.title} des = {item.des} img = {item.img} key={index}/>   
      )}
    </Grid>
  )
}
