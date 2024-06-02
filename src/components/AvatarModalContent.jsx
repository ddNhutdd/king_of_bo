import React, { useEffect, useRef, useState } from 'react';
import ButtonCustom, { buttonType } from './ButtonCustom';
import { DOMAIN2, axiosService } from '../util/service';
import useFetch from '../hooks/useFetch';
import { showErrorToast, showSuccessToast } from '../function/showToastify';
import { useTranslation } from "react-i18next";

function AvatarModalContent(props) {
	const {
		profile,
		getProfile,
		closeModal
	} = props;

	// phần đa ngôn ngữ 
	const { t } = useTranslation();

	// loading
	const [loading, setLoading] = useState(false);

	// file 
	const inputFileRef = useRef(document.createElement('input'));
	const [file, setFile] = useState();
	const [fileUrl, setFileUrl] = useState('');
	const [fileSize, setFileSize] = useState(0.00);
	const handleChange = (event) => {
		if (event?.target?.files[0]) {
			setFile(event?.target?.files[0]);
			setFileUrl(URL.createObjectURL(event.target.files[0]));
			const fileSize = +(event.target.files[0].size / 1024 / 1024).toFixed(2);
			setFileSize(fileSize);
		}
	}
	const inputFileShow = () => {
		inputFileRef.current.click();
	}

	// upload image
	const uploadActionAPI = async (file) => {
		try {
			setLoading(true);
			const formData = new FormData();
			formData.append("userid", profile?.id);
			formData.append("image", file);
			let response = await axiosService.post("api/user/uploadAvatar", formData);
			getProfile();
			closeModal();
			showSuccessToast(response.data.message);
			return response;
		} catch (error) {
			console.log(error)
			showErrorToast(error?.response?.data.message);
		} finally {
			setLoading(false);
		}
	};
	const [
		callUploadActionAPI,
	] = useFetch(uploadActionAPI);
	const uploadImageClickHandle = () => {
		callUploadActionAPI(file);
	}

	// đồng bộ profile với giao diện
	useEffect(() => {
		if (profile) {
			setFile(profile?.avatar);
			setFileUrl(DOMAIN2 + profile?.avatar);
		}
	}, [profile]);

	return (
		<div className="avatar-modal-content">
			<input
				style={{ display: 'none' }}
				type="file"
				ref={inputFileRef}
				onChange={handleChange}
			/>
			<div className='header'>
				{t('uploadImage')}
			</div>
			<div className='content'>
				<div
					className='preview'
					onClick={inputFileShow}
				>
					{
						file ? (
							<img src={fileUrl} alt='dk' />
						) : (
							<>
								<i className="fa-solid fa-arrow-up-from-bracket"></i>
								<div>
									{t('clickToUploadImage')}
								</div>
							</>
						)
					}
				</div>
				<div className='size'>
					<span>
						{t('fileSize')}:
					</span>
					{" "}
					<span>
						{fileSize}MB
					</span>
				</div>
				<div className='note'>
					{t("maxSize")}
				</div>
				<div className='note'>
					{t('noteZoom')}
				</div>
				<div className='upload'>
					<ButtonCustom
						type={buttonType.active}
						style={{
							padding: '15px 85px',
							fontSize: '16px'
						}}
						onClick={uploadImageClickHandle}
						disabled={loading}
					>
						{t('update')}
					</ButtonCustom>
				</div>
			</div>
		</div>
	)
}

export default AvatarModalContent