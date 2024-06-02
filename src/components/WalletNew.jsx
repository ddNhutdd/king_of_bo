import React, {useState } from "react";
import MainWalet from "./MainWallet";
import TradeWallet from "./TradeWallet";
import { Drilling } from "../context/drilling";
import { useTranslation } from "react-i18next";

const tabType = {
	mainWallet: 'mainWallet',
	tradeWallet: 'tradeWallet'
}

function WalletNew() {
	// đa ngôn ngữ 
	const { t } = useTranslation();

	// hide content
	const [showBalance, setShowBalance] = useState(false);
	const renderBalance = () => {
		return showBalance ? (
			<div>
				0
			</div>
		) : (
			<div>
				******
			</div>
		)
	}
	const renderBalanceAction = (translate) => {
		return showBalance ? (
			<>
				<i className="fa-solid fa-eye-slash"></i>
				{translate('hideBalance')}
			</>
		) : (
			<>
				<i className="fa-solid fa-eye"></i>
				{translate('showBalance')}
			</>
		)
	}
	const toggleShowBalance = () => {
		setShowBalance(state => !state);
	}

	// tab
	const [tabSelected, setTabSelected] = useState(tabType.mainWallet);
	const tabItemClickHandle = (tab) => {
		setTabSelected(tab)
	}
	const renderTabContent = () => {
		switch (tabSelected) {
			case tabType.mainWallet:
				return (
					<div className="tab-content-item">
						<MainWalet />
					</div>
				);
			case tabType.tradeWallet:
				return (
					<div className="tab-content-item">
						<TradeWallet />
					</div>
				);
			default:
				break;
		}
	}
	const renderActiveTabItem = (tab) => {
		return tab === tabSelected ? 'active' : ''
	}

	return (
		<div className="wallet-new">
			<div className="panel">
				<div className="panel-content">
					<div className="left">
						<div>
							{t('totalAssets')} (USDT)
						</div>
						{renderBalance()}
					</div>
					<div onClick={toggleShowBalance} className="right">
						{renderBalanceAction(t)}
					</div>
				</div>
			</div>
			<div className="tab-header">
				<div className="tab-header-content">
					<div
						className={`tab-item ${renderActiveTabItem(tabType.mainWallet)}`}
						onClick={tabItemClickHandle.bind(null, tabType.mainWallet)}
					>
						{t('mainWallet')}
					</div>
					<div
						className={`tab-item ${renderActiveTabItem(tabType.tradeWallet)}`}
						onClick={tabItemClickHandle.bind(null, tabType.tradeWallet)}
					>
						{t('exchageWallet')}
					</div>
				</div>
			</div>
			<Drilling.Provider value={{ showBalance }}>
				<div className="tab-content">
					{renderTabContent()}
				</div>
			</Drilling.Provider>
		</div>
	)
}

export default WalletNew;