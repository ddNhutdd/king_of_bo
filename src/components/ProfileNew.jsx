import React, { useRef, useState } from 'react';
import ProfileNewCard from './ProfileNewCard';
import ButtonCustom, { buttonHtmlType, buttonType } from './ButtonCustom';
import InputGroup from './InputGroup';
import SwitchCustom from './SwitchCustom';
import ModalCustom from './ModalCustom';
import AvatarModalContent from './AvatarModalContent';
import VerifyProfileModalContent from './VerifyProfileModalContent';
import TwoFaVerifyModalContent from "./TwoFaVerifyModalContent";
import { useDispatch } from 'react-redux';
import { DOMAIN2, axiosService } from '../util/service';
import useFetch, { API_STATUS } from '../hooks/useFetch';
import ProfileChangePass from './ProfileChangePass';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from "react-i18next";
import defaultAvatar from "../assets/img/avatar-default.svg";

function ProfileNew() {
	// phần đa ngôn ngữ 
	const { t } = useTranslation();

	//dispatch
	const dispatch = useDispatch();

	// render lần đầu
	const first = useRef(false);

	// change photo
	const [avatarModalShow, setAvatarModalShow] = useState(false);
	const [resetAvatarModal, setResetAvatarModal] = useState(0);
	const avatarModalClose = () => {
		setAvatarModalShow(false);
		setResetAvatarModal(state => state + 1);
	}

	//verify profile modal
	const [verifyProfileModalShow, setVerifyProfileModalShow] = useState(false);
	const verifyProfileModalClose = () => {
		setVerifyProfileModalShow(false);
	}

	// twoFaModal
	const [twoFaModalShow, setTwoFaModalShow] = useState(false);
	const [twoFaActiveUI, setTwoFaActiveUI] = useState(false);
	const [resetTwofaModal, setResetTwofaModal] = useState(0);
	const twoFaActiveUIClickHandle = () => {
		setTwoFaModalShow(state => !state);
		setTwoFaActiveUI(state => !state);
	}
	const twoFaModalClose = () => {
		setTwoFaModalShow(false);
		setTwoFaActiveUI(profile[`twofa`]);
		setResetTwofaModal(state => state + 1);
	}

	// change pass modal 
	const [changepassModalShow, setChangepassModalShow] = useState(false);
	const [changepassModalReset, setChangepassModalReset] = useState(0);
	const changepassModalOpen = () => {
		if (profile['twofa'] === 0) {
			return;
		}
		setChangepassModalShow(true);
	}
	const changepassModalClose = () => {
		setChangepassModalShow(false);
		setChangepassModalReset(state => state + 1);
	}

	// update account
	const accountFormik = useFormik({
		initialValues: {
			first: '',
			last: '',
			code: '',
		},
		validationSchema: Yup.object({
			first: Yup.string().required('Required'),
			last: Yup.string().required('Required'),
			code: Yup.string().required('Required')
		}),
		onSubmit: values => {
			if (profile[`twofa`] === 0) {
				return;
			}
			console.log(values)
		},
	});

	// getProfileAPI
	const [profile, setProfile] = useState({});
	const getProfileAPI = async () => {
		try {
			let response = await axiosService.post("api/user/getProfile");
			dispatch({
				type: "UPDATE_USER_AVATAR",
				payload: response.data.data.avatar,
			});
			setProfile(response?.data?.data);
			setTwoFaActiveUI(response?.data?.data['twofa'])
			return response;
		} catch (error) {
			throw error;
		}
	};
	const [
		callGetProfileAPI,
		getProfileAPIStatus,
		getProfileAPIData,
		getProfileAPIError
	] = useFetch(getProfileAPI);
	if (!first.current) {
		first.current = true;
		callGetProfileAPI();
	}

	if (getProfileAPIStatus === API_STATUS.fetching) {
		return (
			<div>
				{t('loading')} ...
			</div>
		)
	}
	if (getProfileAPIStatus === API_STATUS.rejected) {
		console.log(getProfileAPIError);
	}
	return (
		<>
			<div className='profile-new'>
				<div className='item'>
					<ProfileNewCard
						title={t('personalData')}
						className={`card-custom`}
					>
						<form onSubmit={accountFormik.handleSubmit} className='card'>
							<div className="bo-row">
								<div className='bo-col-12'>
									<div className='row-avatar'>
										<div className='image'>
											<img
												src={profile['avatar'] ? `${DOMAIN2}${profile[`avatar`]}` : defaultAvatar}
												alt="dk" />
										</div>
										<div className='change-avatar'>
											<ButtonCustom
												type={buttonType.active}
												style={{
													padding: '16px 32px',
													fontSize: "16px"
												}}
												onClick={setAvatarModalShow.bind(null, true)}
											>
												{t("changePhoto")}
											</ButtonCustom>
										</div>
									</div>
								</div>
							</div>
							<div className="bo-row">
								<div className='bo-col-4 bo-col-lg-6 bo-col-md-12'>
									<InputGroup
										label={t("email")}
										value={profile[`email`]}
										onChange={() => { }}
										disabled={true}
									/>
								</div>
								<div className='bo-col-4 bo-col-lg-6 bo-col-md-12'>
									<InputGroup
										label={t('nickname')}
										placeholder={`dgxa9999@gmail.com`}
										value={profile[`username`]}
										onChange={() => { }}
										disabled={true}
									/>
								</div>
								<div className='bo-col-4 fake-col' />
								<div className='bo-col-4 bo-col-lg-6 bo-col-md-12'>
									<InputGroup
										label={t('firstName')}
										error={
											profile[`twofa`] === 0 ? `* ${t('youMustenable2fa')}` : null
										}
										disabled={profile[`twofa`] === 0}
										id="first"
										name="first"
										onChange={accountFormik.handleChange}
										value={accountFormik.values.first}
									/>
								</div>
								<div className='bo-col-4 bo-col-lg-6 bo-col-md-12'>
									<InputGroup
										label={t('lastName')}
										error={
											profile[`twofa`] === 0 ? `* ${t('youMustenable2fa')}` : null
										}
										disabled={profile[`twofa`] === 0}
										id="last"
										name="last"
										onChange={accountFormik.handleChange}
										value={accountFormik.values.last}
									/>
								</div>
								<div className='bo-col-6 bo-col-md-12'>
									<InputGroup
										label={t('twoFaCode')}
										disabled={profile[`twofa`] === 0}
										id="code"
										name="code"
										onChange={accountFormik.handleChange}
										value={accountFormik.values.code}
									/>
								</div>
							</div>
							<div className="bo-row">
								<div className='bo-col-12'>
									<ButtonCustom
										type={buttonType.active}
										disabled={profile[`twofa`] === 0}
										style={{
											padding: '16px 48px',
											marginBottom: "4px",
											maxWidth: 230
										}}
										htmlType={buttonHtmlType.submit}
									>
										{t('updateAccount')}
									</ButtonCustom>
								</div>
							</div>
						</form>
					</ProfileNewCard>
				</div >
				<div className='item'>
					<ProfileNewCard
						title={t(`accountVerification`)}
						className={`card-custom`}
					>
						<div className='card verify'>
							<div className='bo-row'>
								<div className='bo-col-3 bo-col-md-12'>
									<div className='profile-new--main-text'>
										{t('idVerification')}
									</div>
								</div>
								<div className='bo-col-7 bo-col-md-12'>
									<div className='profile-new--second-text'>
										<div>
											{t('toSecureYourAssets')}
										</div>
										<div>
											{t('fillInCorrect')}
										</div>
									</div>
								</div>
								<div className='bo-col-2 bo-col-md-12'>
									<div className='verify-button'>
										<ButtonCustom
											type={buttonType.active}
											style={{
												color: '#212529',
												maxWidth: 107,

											}}
										>
											{t('verifyNow')}
										</ButtonCustom>
									</div>
								</div>
							</div>
						</div>
					</ProfileNewCard>
				</div>
				<div className='item'>
					<ProfileNewCard
						title={t('security')}
						className={`card-custom`}
					>
						<div className='card security'>
							<div className='bo-row'>
								<div className='bo-col-3 bo-col-md-12'>
									<div className='profile-new--main-text'>
										{t('password')}
									</div>
								</div>
								<div className='bo-col-7 bo-col-md-12'>
									<div className='profile-new--second-text'>
										{t(`changYourPassword`)}
									</div>
								</div>
								<div className='bo-col-2 bo-col-md-12'>
									<div>
										<ButtonCustom
											type={buttonType.active}
											disabled={profile[`twofa`] === 0}
											style={{
												maxWidth: 230
											}}
											onClick={changepassModalOpen}
										>
											{t('changePassword')}
										</ButtonCustom>
									</div>
								</div>
								{
									profile['twofa'] !== 0 || <div style={{ marginBottom: 0 }} className='bo-col-12'>
										<div className='error'>
											{`* ${t('youMustenable2fa')}`}
										</div>
									</div>
								}
							</div>
							<div className='bo-row'>
								<div className='bo-col-3 bo-col-md-7'>
									<div className='profile-new--main-text'>
										2FA Code
										{t(`twoFaCode`)}
									</div>
								</div>
								<div className='bo-col-6 bo-col-md-12 content'>
									<div className='profile-new--second-text'>
										{t('requiredForFundWithdrawalsAndSecurityUpdates')}
									</div>
								</div>
								<div className='bo-col-3 bo-col-md-5'>
									<div className='profile-new--last-cell'>
										<SwitchCustom
											checked={twoFaActiveUI}
											onClick={twoFaActiveUIClickHandle}
										/>
									</div>
								</div>
							</div>
							<div className='bo-row'>
								<div className='bo-col-3 bo-col-md-7'>
									<div className='profile-new--main-text'>
										{t('hideSensitiveData')}
									</div>
								</div>
								<div className='bo-col-6 bo-col-md-12 content'>
									<div className='profile-new--second-text'>
										{t('hideTheInformation')}
									</div>
								</div>
								<div className='bo-col-3 bo-col-md-5'>
									<div className='profile-new--last-cell'>
										<SwitchCustom
										/>
									</div>
								</div>
							</div>
						</div>
					</ProfileNewCard>
				</div>
			</div>
			<ModalCustom
				animation={true}
				closeOnOverlay={true}
				show={avatarModalShow}
				closeModal={avatarModalClose}
				key={resetAvatarModal}
			>
				<AvatarModalContent
					profile={getProfileAPIData?.data?.data}
					getProfile={getProfileAPI}
					closeModal={avatarModalClose}
				/>

			</ModalCustom>
			<ModalCustom
				closeOnOverlay={true}
				show={verifyProfileModalShow}
				closeModal={verifyProfileModalClose}
			>
				<VerifyProfileModalContent />
			</ModalCustom>
			<ModalCustom
				animation={true}
				closeOnOverlay={true}
				show={twoFaModalShow}
				closeModal={twoFaModalClose}
				classNameContainer={"twofa-verify-modal-custom"}
				key={resetTwofaModal}
			>
				<TwoFaVerifyModalContent
					dispatchRedux={dispatch}
					getProfile={getProfileAPI}
					closeModal={twoFaModalClose}
				/>
			</ModalCustom>
			<ModalCustom
				animation={true}
				closeOnOverlay={true}
				show={changepassModalShow}
				closeModal={changepassModalClose}
				classNameContainer={"change-pass-profile-modal-custom"}
				key={changepassModalReset}
			>
				<ProfileChangePass closeModal={changepassModalClose} />
			</ModalCustom>
		</>
	)
}

export default ProfileNew