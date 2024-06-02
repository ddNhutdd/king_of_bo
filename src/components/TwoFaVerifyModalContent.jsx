import React, { useRef, useState } from 'react';
import ButtonCustom, { buttonType } from './ButtonCustom';
import QRCode from "react-qr-code";
import { axiosService } from '../util/service';
import useFetch, { API_STATUS } from '../hooks/useFetch';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { showErrorToast, showSuccessToast } from '../function/showToastify';
import { useTranslation } from "react-i18next";

function TwoFaVerifyModalContent(props) {
	const {
		dispatchRedux,
		getProfile,
		closeModal
	} = props;

	// phần đa ngôn ngữ 
	const { t } = useTranslation();

	// user đã turn on 2fa
	const [isTurnOnTwofa, setIsTurnOnTwofa] = useState(false);

	// render lần đầu
	const first = useRef(false);

	// lấy mã qr
	const [qr, setQr] = useState('');
	const getQrApi = async () => {
		try {
			let response = await axiosService.post("api/user/generateOTPToken");
			setQr(response?.data?.data?.secret);
		} catch (error) {
			const mes = error?.response?.data?.message;
			if (mes === "The user has turned on 2fa") {
				setIsTurnOnTwofa(true);
			}
		}
	};
	const [
		callGetQrApi,
		getQrApiStatus,
	] = useFetch(getQrApi);
	if (!first.current) {
		first.current = true;
		callGetQrApi();
	}
	const renderQrContent = () => {
		switch (getQrApiStatus) {
			case API_STATUS.fetching:
				return (<div style={{ display: 'flex', justifyContent: 'center' }}>Loading ... </div>);

			case API_STATUS.fulfilled:
				return (
					<>
						{
							!isTurnOnTwofa && (
								<>
									<div className='qr'>
										<QRCode
											size={256}
											style={{ height: "auto", maxWidth: "100%", width: "100%" }}
											value={qr || ""}
											viewBox={`0 0 256 256`}
										/>
									</div>
									<div className='bo-row'>
										<div className='bo-col-3'>
											<div className='qr-row-title'>
												{t('backupKey')}
											</div>
										</div>
										<div className='bo-col-9'>
											<div className='input-address'>
												<div className='value'>
													{qr}
												</div>
												<div>
													<CopyToClipboard
														onCopy={onCopy}
														text={qr}>
														<i className="fa-regular fa-copy"></i>
													</CopyToClipboard>
												</div>
											</div>
										</div>
									</div>
								</>
							)
						}

					</>
				);

			case API_STATUS.error:
				return (<div style={{ display: 'flex', justifyContent: 'center' }}>Error !!! </div>);

			default:
				break;
		}
	}

	// onCopy
	const onCopy = () => {
		showSuccessToast('Success')
	}

	// otp
	const [otp, setOtp] = useState('');
	const otpChange = (ev) => {
		setOtp(ev.target.value);
	}

	// turn on
	const turnOn2FA_API = async (code) => {
		try {
			let response = await axiosService.post("api/user/turn2FA", {
				otp: code,
			});

			showSuccessToast(response.data.message);
			dispatchRedux({
				type: "2FA_STATUS_CHANGED",
				payload: 1,
			});
			getProfile();
			closeModal();
		} catch (error) {
			console.log(error);
			showErrorToast(error.response.data.message);
			throw error;
		}
	};
	const [
		callTurnOn2FA_API
	] = useFetch(turnOn2FA_API);
	const turnOnTwoFaClickHandle = () => {
		callTurnOn2FA_API(otp);
	}

	return (
		<div className='twofa-verify-modal-content'>
			<div className='title'>
				Google Authentication
			</div>
			<div className='warning'>
				{
					isTurnOnTwofa ?
						t('turnOffGooglAuthenticator') :
						t('turnOnGooglAuthenticator')
				}
			</div>
			<div className='address'>
				{renderQrContent()}
				<div className='input-group'>
					<label>
						{t('twoFaCode')}
					</label>
					<div className='input'>
						<input
							value={otp}
							onChange={otpChange}
							type="text"
						/>
					</div>
				</div>
				<div className='enable'>
					<ButtonCustom
						type={buttonType.active}
						style={{
							maxWidth: 230,
						}}
						onClick={turnOnTwoFaClickHandle}
					>
						{isTurnOnTwofa ? t(`disable`) : t(`enable`)}
					</ButtonCustom>
				</div>
			</div>
		</div>
	)
}

export default TwoFaVerifyModalContent