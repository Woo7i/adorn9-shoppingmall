const {Router } = require ('express');
const {User} =require ('../models');
const asyncHandler = require('../utils/async-handler');
const hashPassword = require('../utils/hash-password')
// const telCheck = require('../services/telCheck')
const formCheck = require('../services/formCheck')
const check = require('../services/check')
const router = Router();




//회원가입
router.post('/', asyncHandler(async (req,res)=>{
    const {id,password,name,address,phone,email}=req.body;
    // const joindate = req.body.createdAt;
    console.log(req.body.createdAt)
    // const mailCheck = await User.findOne(email)
     const hashedPassword = hashPassword(password)//비밀번호 해쉬화

    // checker.telCheck(phone);
    // checker.mailformCheck(email)
    formCheck.check(id,password,email,phone)
    const mailcheck = await User.findOne({email})//중복 이메일 체크 변수
     if(mailcheck) {throw new Error('이미 가입된 이메일입니다.')} //중복 이메일 체크
     
   const user = await User.create({
      id,
      password: hashedPassword,
      name,
      address,
      phone,
      email,
      // joindate
      })
    res.status(201).send({status:201,msg:`${name}님의 가입을 환영합니다.`,user})
    // res.redirect('/')
}))

//마이 프로필
router.post('/profile' ,asyncHandler(async(req,res)=>{
  const viewkey = req.body.id
  const Profile = await User.findOne({id:viewkey})
  res.status(200).send({status:200,Profile})
}))

//유저 수정
router.put('/', asyncHandler(async(req,res)=>{
  
  const {id,password,name,address,phone,email} = req.body
  // const id = req.body.id
  const mailcheck = await User.findOne({email})
      if(mailcheck) {throw new Error('이미 존재하는 이메일입니다.')} //중복 이메일 체크
     if(password.length<8) {throw new Error('비밀번호는 8글자 이상 입력해주세요')}
  User.findOneAndUpdate({id},{
    password:hashPassword(req.body.password),
    name:req.body.name,
    address:req.body.address,
    phone:req.body.phone,
    email:req.body.email,
    }).exec().then((updateUser)=>
  res.status(200).send({status:200, msg:'개인정보가 수정됐습니다',updateUser}))
  
}))

//회원 탈퇴
router.delete('/',asyncHandler(async(req,res)=>{
  const deid = req.body.id
  await User.deleteOne({id:deid})
  res.status(204).send({status:204, msg:'탈퇴가 완료됐습니다.'})

}))






module.exports = router;