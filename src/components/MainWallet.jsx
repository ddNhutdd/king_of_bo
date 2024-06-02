import React, { useContext, useEffect, useRef, useState } from "react";
import ModalCustom from "./ModalCustom";
import MainWalletModalContent from "./MainWaletModalContent";
import { Drilling } from "../context/drilling";
import { useTranslation } from "react-i18next";
import SelectCustom from "./SelectCustom";

const historyType = {
	usdt: 'usdt',
	commission: 'commission'
}

function MainWalet() {
	// đa ngôn ngữ 
	const { t } = useTranslation();
	const { i18n } = useTranslation();
	const i18nRef = useRef(i18n);

	//dropdown
	const dropdown = [
		{
			key: 1,
			content: (
				<div>
					<img
						style={{
							width: 20,
							height: 20,
							objectFit: 'cover',
							display: 'inline-block',
							marginRight: 5
						}}
						src="https://kingofbo3.net/img/win_coms.43747e2f.svg"
						alt="dk"
					/>
					{t('commission')}
				</div>
			)
		},
		{
			key: 2,
			content: (
				<div>
					<img
						style={{
							width: 20,
							height: 20,
							objectFit: 'cover',
							display: 'inline-block',
							marginRight: 5
						}}
						src="https://kingofbo3.net/img/usdt.bb7c0bc3.svg"
						alt="dk"
					/>
					USDT
				</div>
			)
		},
	]
	const [forceRenderMenu, setForceRenderMenu] = useState(Date.now());

	// modal
	const [showModal, setShowModal] = useState(false);
	const closeModal = () => {
		setShowModal(false);
	}

	// history
	const [historySelected, setHistorySelected] = useState(historyType.usdt);
	const historyItemClickHandle = (history) => {
		setHistorySelected(history)
	}
	const renderClassActiveHistory = (history) => {
		return history === historySelected ? 'active' : ''
	}

	// show balance
	let context = {};
	context = useContext(Drilling);
	const { showBalance } = context;
	const renderAmountToken = () => {
		return showBalance ? 0 : '******'
	}
	const renderEstimate = () => {
		return showBalance ? '~$0' : '******'
	}

	useEffect(() => {
		const handleLanguageChange = (lng) => {
			setForceRenderMenu(Date.now());
		};
		const i18 = i18nRef.current;
		i18.on('languageChanged', handleLanguageChange);

		return () => {
			i18.off('languageChanged', handleLanguageChange);
		}
	}, [])

	return (
		<>
			<div className="main-wallet">
				<div className="balance-table">
					<div className="row">
						<div className="cell">
							<div className="balance">
								<div className="img">
									<img src="https://kingofbo3.net/img/icon-usdt.f667059b.svg" alt="dk" />
								</div>
								<div className="content">
									<div className="content-row">
										<div className="token-name">
											USDT
										</div>
										<div className="amount-token">
											{renderAmountToken()}
										</div>
									</div>
									<div className="content-row">
										<div className="order-name">
											Tether
										</div>
										<div className="estimate">
											{renderEstimate()}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="cell">
							<div className="action">
								<img src="https://kingofbo3.net/img/icon-deposit.afd6195e.svg" alt="dk" />
								<span
									onClick={setShowModal.bind(null, true)}
								>
									{t("deposit")}
								</span>
							</div>
						</div>
						<div className="cell">
							<div className="action">
								<img src="https://kingofbo3.net/img/icon-withdraw.bc763a24.svg" alt="dk" />
								<span
									onClick={setShowModal.bind(null, true)}
								>
									{t("withdraw")}
								</span>
							</div>
						</div>
					</div>
				</div>
				<div className="history">
					<div className="title">
						{t('transactionHistory')}
					</div>
					<div className="select">
						<SelectCustom
							options={dropdown}
							onChange={(item) => { console.log(item) }}
							menuClassCustom={`main-wallet-select-menu`}
							forceRenderMenu={forceRenderMenu}
						>
							<div className="select-header">
								<div className="content">
									{dropdown[0].content}
								</div>
								<div className="down">
									<i className="fa-solid fa-sort-down"></i>
								</div>
							</div>
						</SelectCustom>
					</div>
					<div className="history-table">
						<div className="header">
							<div className="row">
								<div
									className={`header-item ${renderClassActiveHistory(historyType.usdt)}`}
									onClick={historyItemClickHandle.bind(null, historyType.usdt)}
								>
									USDT
								</div>
								<div
									className={`header-item ${renderClassActiveHistory(historyType.commission)}`}
									onClick={historyItemClickHandle.bind(null, historyType.commission)}
								>
									{t('commission')}
								</div>
							</div>
						</div>
						<div className="body">
							<div className="row">
								<div className="nothing">
									{t('nodata')}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<ModalCustom
				show={showModal}
				closeModal={closeModal}
				animation={false}
				closeOnOverlay={false}
			>
				<MainWalletModalContent />
			</ModalCustom >
		</>
	);
}
export default MainWalet;




