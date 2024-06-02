import React from 'react'
import ButtonCustom, { buttonHtmlType, buttonType } from './ButtonCustom'
import ProfileChangePassGroup, { inputType } from './ProfileChangePassGroup'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { axiosService } from '../util/service';
import { showErrorToast, showSuccessToast } from '../function/showToastify';
import useFetch from '../hooks/useFetch';
import { useTranslation } from "react-i18next";

function ProfileChangePass(props) {
	const {
		closeModal,
	} = props;

	// phần đa ngôn ngữ 
	const { t } = useTranslation();

	//formik 
	const formik = useFormik({
		initialValues: {
			current: '',
			new: '',
			confirm: '',
			otp: ''
		},
		validationSchema: Yup.object({
			current: Yup.string().required('require'),
			new: Yup.string().required('require'),
			confirm: Yup.string().required('require').oneOf([Yup.ref("new")], "notMatch"),
			otp: Yup.string().required('require'),
		}),
		onSubmit: values => {
			callChangePasswordApi(values.current, values.new);
		},
	});

	// đổi mật khẩu
	const changePasswordApi = async (password = "", newPassword = "") => {
		try {
			let response = await axiosService.post("/api/user/changePassword", {
				password,
				newPassword
			});
			showSuccessToast(response.data.message);
			closeModal();
			return response;
		} catch (error) {
			console.log(error);
			showErrorToast(error.response.data.message);
			throw error;
		}
	};
	const [callChangePasswordApi] = useFetch(changePasswordApi)

	return (
		<div className='profile-change-pass'>
			<div className='title'>
				{t('changePass')}
			</div>
			<form onSubmit={formik.handleSubmit} className='list'>
				<div className='item'>
					<ProfileChangePassGroup
						label={t('currentPassword')}
						type={inputType.pass}
						id="current"
						name="current"
						onChange={formik.handleChange}
						value={formik.values.current}
						error={t((formik.touched.current && formik.errors.current) || '')}
					/>
				</div>
				<div className='item'>
					<ProfileChangePassGroup
						label={t('newPassword')}
						type={inputType.pass}
						id="new"
						name="new"
						onChange={formik.handleChange}
						value={formik.values.new}
						error={t((formik.touched.new && formik.errors.new) || "")}
					/>
				</div>
				<div className='item'>
					<ProfileChangePassGroup
						label={t('confirmNewPassword')}
						type={inputType.pass}
						id="confirm"
						name="confirm"
						onChange={formik.handleChange}
						value={formik.values.confirm}
						error={t((formik.touched.confirm && formik.errors.confirm) || "")}
					/>
				</div>
				<div className='item'>
					<ProfileChangePassGroup
						label={t('googleAuthenticator')}
						type={inputType.text}
						id="otp"
						name="otp"
						onChange={formik.handleChange}
						value={formik.values.otp}
						error={t((formik.touched.otp && formik.errors.otp) || "")}
					/>
				</div>
				<div className='item'>
					<ButtonCustom
						type={buttonType.active}
						style={{
							height: '47px',
							padding: '11px 15px',
							fontSize: '16px'
						}}
						htmlType={buttonHtmlType.submit}
					>
						{t('changePass')}
					</ButtonCustom>
				</div>
			</form>
		</div>
	)
}

export default ProfileChangePass