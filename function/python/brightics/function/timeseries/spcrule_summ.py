#-*- coding: utf-8 -*-

import pandas as pd
import numpy as np
import math

# SPC rule 기반 이상감지
# 문의사항은 민경란 kran.min@samsung.com 으로 부탁드립니다
###### ruleset informtion ######
# 0. basic
# 1. Nelson
# 2. WE
# 3. WE (supplemental)
# 4. WE (Asymmetric control limits)
# 5. Juran
# 6. Gitlow 
# 7. Duncan 
# 8. Westgard
# 9. AIAG (보류)
# 10. Hughes (보류)
################################


def setting_ruleset(num) :
    ruleset = pd.DataFrame({'ruleset_id':[num]})
    ruleset['name'] = "none"
    ruleset['description'] = u" * 룰셋이 존재하지 않습니다"
    ruleset['num_rules'] = 0
    ruleset['window_size'] = 0
    if num == 1 :
	    ruleset['name'] = u'Nelson Rule'
	    ruleset['description'] = u""" * Nelson 규칙세트가 정의하는 아래 규칙 중 하나라도 해당 할 경우 이상으로 판단함.
    [규칙 1]  최근 샘플이 '평균 +- 3*표준편차' 범위를 벗어남.
    [규칙 2]  최근 3 샘플 중 2개 이상이 같은 방향으로 '평균 +- 2*표준편차' 범위를 벗어남.
    [규칙 3]  최근 5 샘플 중 4개 이상이 같은 방향으로 '평균 +- 표준편차' 범위를 벗어남.	
    [규칙 4]  최근 9 샘플이 연속으로 평균을 기준으로 같은 방향에 위치함.
    [규칙 5]  최근 6 샘플이 연속으로 증가 (또는 감소) 함.
    [규칙 6]  최근 15 샘플이 연속으로 '평균 +- 표준편차' 범위를 벗어나지 않음.
    [규칙 7]  최근 14 샘플이 연속으로 증가와 감소의 전환을 반복함.
    [규칙 8]  최근 8 샘플이 연속으로 '평균 +- 표준편차' 범위를 벗어남. """
	    ruleset['num_rules'] = 8
	    ruleset['window_size'] = 15
    elif num ==2 :
	    ruleset['name'] = u'WE Rule'
	    ruleset['description'] = u""" * Western Electric 규칙세트가 정의하는 아래 규칙 중 하나라도 해당 할 경우 이상으로 판단함.
    [규칙 1]  최근 샘플이 '평균 +- 3*표준편차' 범위를 벗어남.
    [규칙 2]  최근 3 샘플 중 2개 이상이 같은 방향으로 '평균 + 2*표준편차' 범위를 벗어남.
    [규칙 3]  최근 5 샘플 중 4개 이상이 같은 방향으로 '평균 + 표준편차' 범위를 벗어남.
    [규칙 4]  최근 8 샘플이 연속으로 평균을 기준으로 같은 방향에 위치함. """
	    ruleset['num_rules'] = 4
	    ruleset['window_size'] = 8	   
    elif num == 3 :
	    ruleset['name'] = u'WE supplemental Rule'
	    ruleset['description'] = u""" * Western Electric supplemental 규칙세트가 정의하는 아래 규칙 중 하나라도 위반할 경우 이상으로 판단함.
    [규칙 1]  최근 샘플이 '평균 +- 3*표준편차' 범위를 벗어남.
    [규칙 2]  최근 3 샘플 중 2개 이상이 같은 방향으로 '평균 + 2*표준편차' 범위를 벗어남.
    [규칙 3]  최근 5 샘플 중 4개 이상이 같은 방향으로 '평균 + 표준편차' 범위를 벗어남.
    [규칙 4]  최근 8 샘플이 연속으로 평균을 기준으로 같은 방향에 위치함. 
    [규칙 5]  최근 6 샘플이 연속으로 증가 (또는 감소) 함.
    [규칙 6]  최근 15 샘플이 연속으로 '평균 +- 표준편차' 범위를 벗어나지 않음.
    [규칙 7]  최근 14 샘플이 연속으로 증가와 감소의 전환을 반복함.
    [규칙 8]  최근 8 샘플이 연속으로 '평균 +- 표준편차' 범위를 벗어남. """
	    ruleset['num_rules'] = 8
	    ruleset['window_size'] = 15
    elif num ==4 :
	    ruleset['name'] = u'WE Rule - Asymmetric control limits for small sample'
	    ruleset['description'] = u""" * Western Electric 규칙세트가 정의하는 아래 규칙 중 하나라도 위반할 경우 이상으로 판단함
    [규칙 1]  최근 샘플이 '평균 + 3*표준편차' 범위를 벗어남.
    [규칙 2]  최근 2 샘플이 연속으로 '평균 + 2*표준편차' 위를 벗어남.
    [규칙 3]  최근 3 샘플이 연속으로 '평균 + 표준편차' 위를 벗어남.
    [규칙 4]  최근 7 샘플이 연속으로 '평균' 위에 위치함.
	[규칙 5]  최근 10 샘플이 연속으로 '평균' 아래에 위치함.
    [규칙 6]  최근 6 샘플이 연속으로 '평균 - 표준편차' 아래를 벗어남.
    [규칙 7]  최근 4 샘플이 연속으로 '평균 - 2*표준편차' 아래를 벗어남. """
	    ruleset['num_rules'] = 7
	    ruleset['window_size'] = 10
    elif num == 5 :
	    ruleset['name'] = u'Juran Rule'
	    ruleset['description'] = u""" * Juran 규칙세트가 포함하는 아래 규칙 중 하나라도 위반할 경우 이상으로 판단함.
    [규칙 1]  최근 샘플이 '평균 + 3*표준편차' 범위를 벗어남.
    [규칙 2]  최근 3 샘플 중 2개 이상이 같은 방향으로 '평균 +- 2*표준편차' 범위를 벗어남.
    [규칙 3]  최근 5 샘플 중 4개 이상이 같은 방향으로 '평균 +- 표준편차' 범위를 벗어남. 
    [규칙 4]  최근 9 샘플이 연속으로 평균을 기준으로 같은 방향에 위치함.
    [규칙 5]  최근 6 샘플이 연속으로 증가 (또는 감소) 함.
    [규칙 6]  최근 8 샘플이 연속으로 '평균 +- 표준편차' 범위를 벗어남. """
	    ruleset['num_rules'] =  6
	    ruleset['window_size'] = 9
    elif num == 6 :
	    ruleset['name'] = u'Gitlow Rule'
	    ruleset['description'] = u""" * Gitlow 규칙세트가 포함하는 아래 규칙 중 하나라도 위반할 경우 이상으로 판단함. 
    [규칙 1]  최근 샘플이 '평균 + 3*표준편차' 범위를 벗어남. 
    [규칙 2]  최근 3 샘플 중 2개 이상이 같은 방향으로 '평균 +- 2*표준편차' 범위를 벗어남.
    [규칙 3]  최근 5 샘플 중 4개 이상이 같은 방향으로 '평균 +- 표준편차' 범위를 벗어남. 
    [규칙 4]  최근 8 샘플이 연속으로 평균을 기준으로 같은 방향에 위치함.
    [규칙 5]  최근 8 샘플이 연속으로 증가 (또는 감소) 함.
    """
	    ruleset['num_rules'] = 5
	    ruleset['window_size'] = 8
    elif num == 7 :
	    ruleset['name'] = u'Duncan Rule'
	    ruleset['description'] = u""" * Duncan 규칙세트가 포함하는 아래 규칙 중 하나라도 위반할 경우 이상으로 판단함. 
    [규칙 1]  최근 샘플이 '평균 + 3*표준편차' 범위를 벗어남. 
    [규칙 2]  최근 3 샘플 중 2개 이상이 같은 방향으로 '평균 +- 2*표준편차' 범위를 벗어남.
    [규칙 3]  최근 5 샘플 중 4개 이상이 같은 방향으로 '평균 +- 표준편차' 범위를 벗어남. 
    [규칙 4]  최근 7 샘플이 연속으로 증가 (또는 감소) 함."""
	    ruleset['num_rules'] = 4
	    ruleset['window_size'] = 7
    elif num == 8 :
	    ruleset['name'] = u'Westgard Rule'
	    ruleset['description'] = u""" * Westgard 규칙세트가 포함하는 아래 규칙 중 하나라도 위반할 경우 이상으로 판단함.
    [규칙 1]  최근 샘플이 '평균 + 3*표준편차' 범위를 벗어남. 
    [규칙 2]  최근 2 샘플이 같은 방향으로 '평균 +- 2*표준편차' 범위를 벗어남.
    [규칙 3]  최근 4 샘플이 같은 방향으로 '평균 +- 표준편차' 범위를 벗어남.
    [규칙 4]  최근 10 샘플이 연속으로 평균을 기준으로 같은 방향에 위치함.
    [규칙 5]  최근 8 샘플이 연속으로 증가 (또는 감소) 함.
    [규칙 6]  최근 2 샘플이 서로 반대의 평균 +- 2*표준편차' 범위를 벗어남."""
	    ruleset['num_rules'] = 6
	    ruleset['window_size'] = 10
    elif num == 9 : # 보류
	    ruleset['name'] = u'AIAG 규칙세트'
	    ruleset['description'] = u""" * Automotive Industry Action Group 규칙세트가 포함하는 아래 규칙 중 하나라도 위반할 경우 이상으로 판단함.
    [규칙 1]  모든 샘플은 '평균 + 3*표준편차' 범위를 벗어나지 않음.
    [규칙 2]  7 샘플이 연속으로 평균을 기준으로 같은 방향에 위치하지 않음.
    [규칙 3]  7 샘플이 연속으로 증가 (또는 감소) 하지 않음. """
	    ruleset['num_rules'] = 3
	    ruleset['window_size'] = 7
    elif num ==0 : 
	    ruleset['name'] = u'basic 규칙'
	    ruleset['description'] = u""" * basic 규칙세트가 포함하는 아래 규칙 중 하나라도 해당 할 경우 이상으로 판단함.
    [규칙 1]  모든 샘플은 '평균 +- 3*표준편차' 범위를 벗어남. """
	    ruleset['num_rules'] = 1
	    ruleset['window_size'] = 15
    return ruleset

  
  
  

def new_gaussmodel(old_gauss,sample_value) : 
    gauss = pd.DataFrame({'mean':old_gauss['mean'], 'stddev':old_gauss['stddev'], 'examined_sample_counter':old_gauss['examined_sample_counter']})
    if gauss.loc[0,'examined_sample_counter'] == 0 :
	    gauss.loc[0,'examined_sample_counter'] = 1
	    model_update_counter = gauss.loc[0,'examined_sample_counter']
	    learningrate = 1.0/model_update_counter
	    gauss.loc[0,'mean'] = sample_value
    else : 
    # elif ( gauss['stddev'][0] == 0 ) | (gauss['mean'][0] - 6.0 *gauss['stddev'][0] <= sample_value[0] <= gauss['mean'][0] + 6.0 *gauss['stddev'][0] ) | (gauss['num_examined_samples']<15)): 
	    gauss.loc[0,'examined_sample_counter'] = gauss.loc[0,'examined_sample_counter'] + 1
	    model_update_counter = gauss.loc[0,'examined_sample_counter']
	    learningrate = 1.0/model_update_counter
	    gauss.loc[0,'mean'] = ((1.0-learningrate) * gauss.loc[0,'mean']) + ( learningrate * sample_value )
	    if abs(sample_value - gauss.loc[0,'mean'])>0.000001 :
		    variance = gauss.loc[0,'stddev'] *gauss.loc[0,'stddev']
		    variance = ((1.0-learningrate) * variance) + (learningrate * math.pow(sample_value-gauss.loc[0,'mean'],2.0))
		    gauss.loc[0,'stddev'] = math.sqrt(variance)
    return gauss
 
def same_side_in_a_row(queue,num) : # 해당 sample 포함해서 일렬로
    # 1 (positive sisade) / 0 (mean) / -1 (negative side)
    if (queue[-num:] == queue.loc[queue.index.max()]).all()[0] : 
	    return 1 # in a row : fail
    else : 
	    return 0 # not in a row : pass
	  
def different_side_in_a_row(queue,num) : # /\/\/\/\
    # 1 (positive side) / 0 (mean) / -1 (negative side)
    length = len(queue)
    queue = queue.value.tolist()
    for i in range(0,num-1) :
	    if queue[length-1-i] == queue[length-2-i] : # same side
		    return 0
	    elif queue[length-1-i] == 0 : ## middle (mean을 기준으로 왔다갔다해야하는데 가운데일경우)
		    return 0
	    elif queue[length-2-i] == 0 : ## middle (mean을 기준으로 왔다갔다해야하는데 가운데일경우)
		    return 0
	    else :
		    pass # different side
    return 1 # success
	  
def same_side_in_a_row_n1_of_n2(queue,limit,num) : # num 중에 limit개 확인
    # 1 (positive side) / 0 (mean) / -1 (negative side)
    cnt=[0,0] # positive & negative side count
    length = len(queue)
    queue = queue.value.tolist()
    for i in range(0,num) :
	    if queue[length-1-i] == 1 : # positive side count
		    cnt[0]+=1 
	    elif queue[length-1-i] == -1 : # negative side count
		    cnt[1]+=1
    if any(c >= limit for c in cnt) :
	    return 1 # exceed limit
    return 0 


def check_sign(x,y) : # y 를 기준으로 x의 부호 판별
    if x > y : 
	    return 1  # positive side
    elif -y <= x <= y :
	    return 0  # equal
    else :
	    return -1 # negtive side

def basic(queue,gauss) : # Ruleset 0
    violated_rule_flag = list('0') # 1 rules
    queue = pd.DataFrame(queue)
    mean = float(gauss['mean'])
    stddev = float(gauss['stddev'])
    queue_dev = queue-mean  # deviation
    # rule 1 Any single data point falling above the +3σ limit
    if (3*stddev < abs(queue_dev.iloc[len(queue)-1])).value :
	    violated_rule_flag[0]='1'
    return ''.join(violated_rule_flag)  
  
def nelson(queue,gauss) : # Ruleset 1
    violated_rule_flag = list('00000000') # 8 rules
    queue = pd.DataFrame(queue)
    mean = float(gauss['mean'])
    stddev = float(gauss['stddev'])
    queue_dev = queue-mean 			# deviation
    queue_sign = np.sign(queue_dev) # mean 기준 부호
    queue_outofsig = queue_dev.applymap(lambda x : check_sign(x,stddev))    # 1 sigma 기준 부호
    queue_outof2sig = queue_dev.applymap(lambda x : check_sign(x,2*stddev)) # 2 sigma 기준 부호
    queue_diff = queue.diff()		   # difference 두 값의 차이
    queue_incdec = np.sign(queue_diff) # is increasing or decreasing? 두 값차이의 부호 = 증감여부
    # rule 1 One point is more than 3 standard deviations from the mean.
    # 측정값이 3시그마를 벗어난경우 허용 범위를 이탈함
    # if not (-3*stddev < queue_dev.iloc[len(queue)-1] < 3*stddev)
    if (3*stddev < abs(queue_dev.iloc[len(queue)-1])).value : # 3시그마 벗어난 경우
	    violated_rule_flag[0]='1'
    # rule 2 Two (or three) out of three points in a row are more than 2 standard deviations from the mean in the same direction.
	# 연속된 3개의 측정값 중 2개 이상이 평균 기준 한방향으로 2시그마 이상인경우, 허용범위를 중간적으로 이탈
    if same_side_in_a_row_n1_of_n2(queue_outof2sig,2,3) :
	    violated_rule_flag[1]='1'
    # rule 3 Four (or five) out of five points in a row are more than 1 standard deviation from the mean in the same direction.
    # 연속된 5개의 측정값 중 4개 이상이 평균 기준 한방향으로 1시그마 이상인경우, 허용범위를 약간 이탈
    if same_side_in_a_row_n1_of_n2(queue_outofsig,4,5) :
	    violated_rule_flag[2]='1'
    # rule 4 Nine (or more) points in a row are on the same side of the mean.
    # 9개 이상의 측정값이 연속으로 평균위거나 아래인경우 지속적인 편향 존재
    if same_side_in_a_row(queue_sign,9) :
	    violated_rule_flag[3]='1'
	# rule 5 Six (or more) points in a row are continually increasing (or decreasing).
    # 6개 이상의 측정값이 연속으로 증가하거나 감소하는 경우 이상 추세가 존재
    if same_side_in_a_row(queue_incdec,5) :
	    violated_rule_flag[4]='1'
    # rule 6 Fifteen points in a row are all within 1 standard deviation of the mean on either side of the mean.
    # 15개의 측정 값이 연속으로 1시그마 선 안에 있는 경우 변화가 적으므로 이상함
    if same_side_in_a_row(abs(queue_dev) < stddev,15) :
	    violated_rule_flag[5]='1'	
    # rule 7 Fourteen (or more) points in a row alternate in direction, increasing then decreasing.
    # 연속된 14개 이상의 점이 증감반복 오가는것은 오차 범위의 이상
    if different_side_in_a_row(queue_incdec,13) :
	    violated_rule_flag[6]='1'
    # rule 8 Eight points in a row exist, but none within 1 standard deviation of the mean, and the points are in both directions from the mean.
    # 연속된 8개의 측정값 중 하나도 1시그마 안에 존재하지 않는 경우가 거의 없으므로 이상함
    if same_side_in_a_row(abs(queue_dev) > stddev,8) :
	    violated_rule_flag[7]='1'
    return ''.join(violated_rule_flag)
  
def WE(queue,gauss) : # Ruleset 2
    violated_rule_flag = list('0000') # 4 rules
    queue = pd.DataFrame(queue) 
    mean = float(gauss['mean'])
    stddev = float(gauss['stddev'])
    queue_dev = queue-mean 			# deviation
    queue_sign = np.sign(queue_dev)
    queue_outofsig = queue_dev.applymap(lambda x : check_sign(x,stddev))
    queue_outof2sig = queue_dev.applymap(lambda x : check_sign(x,2*stddev))
    # rule 1 Any single data point falls outside the 3σ-limit from the centerline (i.e., any point that falls outside Zone A, beyond either the upper or lower control limit)
    #if not ((-3*stddev < queue_dev.iloc[len(queue)-1] ) & (queue.iloc[len(queue)-1]< 3*stddev)).all :
    if (3*stddev < abs(queue_dev.iloc[len(queue)-1])).value :
	    violated_rule_flag[0]='1'
    # rule 2 Two out of three consecutive points fall beyond the 2σ-limit (in zone A or beyond), on the same side of the centerline	
	# 연속된 3개의 측정값 중 2개 이상이 평균 기준 한방향으로 2시그마 이상인경우, 허용범위를 중간적으로 이탈
    if same_side_in_a_row_n1_of_n2(queue_outof2sig,2,3) :
	    violated_rule_flag[1]='1'
    # rule 3 Four out of five consecutive points fall beyond the 1σ-limit (in zone B or beyond), on the same side of the centerline
    # 연속된 5개의 측정값 중 4개 이상이 평균 기준 한방향으로 1시그마 이상인경우, 허용범위를 약간 이탈
    if same_side_in_a_row_n1_of_n2(queue_outofsig,4,5) :
	    violated_rule_flag[2]='1'
    # rule 4 eight consecutive points fall on the same side of the centerline (in zone C or beyond)
    # 8개 이상의 측정값이 연속으로 평균위거나 아래인경우 지속적인 편향 존재
    if same_side_in_a_row(queue_sign,8) :
	    violated_rule_flag[3]='1'
    return ''.join(violated_rule_flag)
  
def WE_supple(queue,gauss) : # Ruleset 3
    violated_rule_flag = list('00000000') # 8 rules
    queue = pd.DataFrame(queue) 
    mean = float(gauss['mean'])
    stddev = float(gauss['stddev'])
    queue_dev = queue-mean 			# deviation
    queue_sign = np.sign(queue_dev)
    queue_outofsig = queue_dev.applymap(lambda x : check_sign(x,stddev))
    queue_outof2sig = queue_dev.applymap(lambda x : check_sign(x,2*stddev))
    queue_diff = queue.diff()		# difference
    queue_incdec = np.sign(queue_diff) # is increasing or decreasing?
    # rule 1 Any single data point falls outside the 3σ-limit from the centerline (i.e., any point that falls outside Zone A, beyond either the upper or lower control limit)
    # 1. The most recent point plots outside one of the 3-sigma control limits.
	# If a point lies outside either of these limits, there is only a 0.3% chance that this was caused by the normal process.
    if (3*stddev < abs(queue_dev.iloc[len(queue)-1])).value :
	    violated_rule_flag[0]='1'
    # rule 2 Two out of three consecutive points fall beyond the 2σ-limit (in zone A or beyond), on the same side of the centerline	
	# 2. Two of the three most recent points plot outside and on the same side as one of the 2-sigma control limits.
	# The probability that any point will fall outside the warning limit is only 5%.
	# The chances that two out of three points in a row fall outside the warning limit is only about 1%.
	# 연속된 3개의 측정값 중 2개 이상이 평균 기준 한방향으로 2시그마 이상인경우, 허용범위를 중간적으로 이탈
    if same_side_in_a_row_n1_of_n2(queue_outof2sig,2,3) :
	    violated_rule_flag[1]='1'
    # rule 3 Four out of five consecutive points fall beyond the 1σ-limit (in zone B or beyond), on the same side of the centerline
	# 3. Four of the five most recent points plot outside and on the same side as one of the 1-sigma control limits.
	# In normal processing, 68% of points fall within one sigma of the mean, and 32% fall outside it.
	# The probability that 4 of 5 points fall outside of one sigma is only about 3%.
    # 연속된 5개의 측정값 중 4개 이상이 평균 기준 한방향으로 1시그마 이상인경우, 허용범위를 약간 이탈
    if same_side_in_a_row_n1_of_n2(queue_outofsig,4,5) :
	    violated_rule_flag[2]='1'
    # rule 4 Nine consecutive points fall on the same side of the centerline (in zone C or beyond)
	# 4. Eight out of the last eight points plot on the same side of the center line, or target value.
	# Sometimes you see this as 9 out of 9, or 7 out of 7. There is an equal chance that any given point will fall above or below the mean.
	# The chances that a point falls on the same side of the mean as the one before it is one in two.
	# The odds that the next point will also fall on the same side of the mean is one in four. 
	# The probability of getting eight points on the same side of the mean is only around 1%.
    # 8개 이상의 측정값이 연속으로 평균위거나 아래인경우 지속적인 편향 존재
    if same_side_in_a_row(queue_sign,8) :
	    violated_rule_flag[3]='1'
    # rule 5 Six points in a row increasing or decreasing.
	# The same logic is used here as for rule 4 above. Sometimes this rule is changed to seven points rising or falling.
	# 6 샘플 연속 증가 또는 감소
    if same_side_in_a_row(queue_incdec,5) :
	    violated_rule_flag[4]='1'
	# 6. Fifteen points in a row within one sigma. In normal operation, 68% of points will fall within one sigma of the mean.
	# The probability that 15 points in a row will do so, is less than 1%.
	# 15샘플 연속으로 1sigma 이내에만 존재
    if same_side_in_a_row(abs(queue_dev) < stddev,15) :
	    violated_rule_flag[5]='1'
	#7. Fourteen points in a row alternating direction.
	# The chances that the second point is always higher than (or always lower than) the preceding point, for all seven pairs is only about 1%.
	# 14샘플 연속으로 전환
    if different_side_in_a_row(queue_incdec,13) :
	    violated_rule_flag[6]='1'
	#8. Eight points in a row outside one sigma.
	# Since 68% of points lie within one sigma of the mean, the probability that eight points in a row fall outside of the one-sigma line is less than 1%.
	# 8포인트 연속으로 1sig안에 조재하지 않음
    if same_side_in_a_row(abs(queue_dev) > stddev,8) :
	    violated_rule_flag[7]='1'
    return ''.join(violated_rule_flag)  
 

def WE_asymm(queue,gauss) : # Ruleset 4
    violated_rule_flag = list('0000000') # 7 rules
    queue = pd.DataFrame(queue)
    mean = float(gauss['mean'])
    stddev = float(gauss['stddev'])
    queue_dev = queue-mean 			# deviation
    queue_sign = np.sign(queue_dev)
    queue_diff = queue.diff()		# difference
    queue_incdec = np.sign(queue_diff) # is increasing or decreasing?
    # rule 1 Any single data point falling above the +3σ limit
    #if not (queue.iloc[len(queue)-1]< 3*stddev).all :
    if (3*stddev < (queue_dev.iloc[len(queue)-1])).value :
	    violated_rule_flag[0]='1'
    # rule 2 Two consecutive points falling above the +2σ-limit (in the upper zone A or above)
    if same_side_in_a_row(queue_dev > 2*stddev,2) :
	    violated_rule_flag[1]='1'
    # rule 3 Three consecutive points falling above the +1σ-limit (in the upper zone B or above)
    if same_side_in_a_row(queue_dev > stddev,3) :
	    violated_rule_flag[2]='1'
    # rule 4 Seven consecutive points falling above the centerline (in the upper zone C or above)
    if same_side_in_a_row(queue_dev > 0 ,7) :
	    violated_rule_flag[3]='1'
    # rule 5 Ten consecutive points falling below the centerline (in the lower zone C or below)
    if same_side_in_a_row(queue_dev < 0 ,10) :
	    violated_rule_flag[4]='1'
    # rule 6 Six consecutive points falling below the -1σ-limit (in the lower zone B or below)
    if same_side_in_a_row(queue_dev < -stddev ,6) :
	    violated_rule_flag[5]='1'
    # rule 7 Four consecutive points falling below the -2σ-limit (in the lower zone A)
    if same_side_in_a_row(queue_dev < -2*stddev ,4) :
	    violated_rule_flag[6]='1'
    return ''.join(violated_rule_flag)  
	
def Juran(queue,gauss) : # Ruleset 5
    violated_rule_flag = list('000000') # 6 rules
    queue = pd.DataFrame(queue)
    mean = float(gauss['mean'])
    stddev = float(gauss['stddev'])
    queue_dev = queue-mean 			# deviation
    queue_sign = np.sign(queue_dev) # mean 기준 부호
    queue_outofsig = queue_dev.applymap(lambda x : check_sign(x,stddev))    # 1 sigma 기준 부호
    queue_outof2sig = queue_dev.applymap(lambda x : check_sign(x,2*stddev)) # 2 sigma 기준 부호
    queue_diff = queue.diff()		   # difference 두 값의 차이
    queue_incdec = np.sign(queue_diff) # is increasing or decreasing? 두 값차이의 부호 = 증감여부
    if (3*stddev < abs(queue_dev.iloc[len(queue)-1])).value :
	    violated_rule_flag[0]='1'
	# 연속된 3개의 측정값 중 2개 이상이 평균 기준 한방향으로 2시그마 이상인경우, 
    if same_side_in_a_row_n1_of_n2(queue_outof2sig,2,3) :
	    violated_rule_flag[1]='1'
    # 연속된 5개의 측정값 중 4개 이상이 평균 기준 한방향으로 1시그마 이상인경우, 
    if same_side_in_a_row_n1_of_n2(queue_outofsig,4,5) :
	    violated_rule_flag[2]='1'
    # 9개 이상의 측정값이 연속으로 평균위거나 아래인경우 지속적인 편향 존재
    if same_side_in_a_row(queue_sign,9) :
	    violated_rule_flag[3]='1'
	# 6개 이상의 측정값이 연속으로 증가하거나 감소하는 경우 이상 추세가 존재
    if same_side_in_a_row(queue_incdec,5) :
	    violated_rule_flag[4]='1'
	# 8포인트 연속으로 1sig안에 조재하지 않음
    if same_side_in_a_row(abs(queue_dev) > stddev,8) :
	    violated_rule_flag[5]='1'
    return ''.join(violated_rule_flag)

		
def Gitlow(queue,gauss) : #Ruleset 6
    violated_rule_flag = list('00000') # 5 rules
    queue = pd.DataFrame(queue)
    mean = float(gauss['mean'])
    stddev = float(gauss['stddev'])
    queue_dev = queue-mean 			# deviation
    queue_sign = np.sign(queue_dev) # mean 기준 부호
    queue_outofsig = queue_dev.applymap(lambda x : check_sign(x,stddev))    # 1 sigma 기준 부호
    queue_outof2sig = queue_dev.applymap(lambda x : check_sign(x,2*stddev)) # 2 sigma 기준 부호
    queue_diff = queue.diff()		   # difference 두 값의 차이
    queue_incdec = np.sign(queue_diff) # is increasing or decreasing? 두 값차이의 부호 = 증감여부
    if (3*stddev < abs(queue_dev.iloc[len(queue)-1])).value :
	    violated_rule_flag[0]='1'
	# 연속된 3개의 측정값 중 2개 이상이 평균 기준 한방향으로 2시그마 이상인경우, 허용범위를 중간적으로 이탈
    if same_side_in_a_row_n1_of_n2(queue_outof2sig,2,3) :
	    violated_rule_flag[1]='1'
    # 연속된 5개의 측정값 중 4개 이상이 평균 기준 한방향으로 1시그마 이상인경우, 허용범위를 약간 이탈
    if same_side_in_a_row_n1_of_n2(queue_outofsig,4,5) :
	    violated_rule_flag[2]='1'
    # 8개 이상의 측정값이 연속으로 평균위거나 아래인경우 지속적인 편향 존재
    if same_side_in_a_row(queue_sign,8) :
	    violated_rule_flag[3]='1'
	# 8개 이상의 측정값이 연속으로 증가하거나 감소하는 경우 이상 추세가 존재
    if same_side_in_a_row(queue_incdec,7) :
	    violated_rule_flag[4]='1'
    return ''.join(violated_rule_flag)

def Duncan(queue,gauss) : #Ruleset 7
    violated_rule_flag = list('0000') # 4 rules
    queue = pd.DataFrame(queue)
    mean = float(gauss['mean'])
    stddev = float(gauss['stddev'])
    queue_dev = queue-mean 			# deviation
    queue_outofsig = queue_dev.applymap(lambda x : check_sign(x,stddev))    # 1 sigma 기준 부호
    queue_outof2sig = queue_dev.applymap(lambda x : check_sign(x,2*stddev)) # 2 sigma 기준 부호
    queue_diff = queue.diff()		   # difference 두 값의 차이
    queue_incdec = np.sign(queue_diff) # is increasing or decreasing? 두 값차이의 부호 = 증감여부
    if (3*stddev < abs(queue_dev.iloc[len(queue)-1])).value :
	    violated_rule_flag[0]='1'
	# 연속된 3개의 측정값 중 2개 이상이 평균 기준 한방향으로 2시그마 이상인경우, 허용범위를 중간적으로 이탈
    if same_side_in_a_row_n1_of_n2(queue_outof2sig,2,3) :
	    violated_rule_flag[1]='1'
    # 연속된 5개의 측정값 중 4개 이상이 평균 기준 한방향으로 1시그마 이상인경우, 허용범위를 약간 이탈
    if same_side_in_a_row_n1_of_n2(queue_outofsig,4,5) :
	    violated_rule_flag[2]='1'
	# 7개 이상의 측정값이 연속으로 증가하거나 감소하는 경우 이상 추세가 존재
    if same_side_in_a_row(queue_incdec,6) :
	    violated_rule_flag[3]='1'
    return ''.join(violated_rule_flag)



def Westgard(queue,gauss) : # Ruleset 8
    violated_rule_flag = list('000000') # 6 rules
    queue = pd.DataFrame(queue)
    mean = float(gauss['mean'])
    stddev = float(gauss['stddev'])
    queue_dev = queue-mean 			# deviation
    queue_sign = np.sign(queue_dev) # mean 기준 부호
    queue_outofsig = queue_dev.applymap(lambda x : check_sign(x,stddev))    # 1 sigma 기준 부호
    queue_outof2sig = queue_dev.applymap(lambda x : check_sign(x,2*stddev)) # 2 sigma 기준 부호
    queue_diff = queue.diff()		   # difference 두 값의 차이
    queue_incdec = np.sign(queue_diff) # is increasing or decreasing? 두 값차이의 부호 = 증감여부
    if (3*stddev < abs(queue_dev.iloc[len(queue)-1])).value :
	    violated_rule_flag[0]='1'
	# 2개 이상의 측정값이 평균 기준 한방향으로 2시그마 이상인경우
    if same_side_in_a_row(queue_outof2sig,2) :
	    violated_rule_flag[1]='1'
    # 4개 이상의 측정값이 평균 기준 한방향으로 1시그마 이상인경우
    if same_side_in_a_row(queue_outofsig,4) :
	    violated_rule_flag[2]='1'
    # 10개 이상의 측정값이 연속으로 평균위거나 아래인경우 지속적인 편향 존재
    if same_side_in_a_row(queue_sign,10) :
	    violated_rule_flag[3]='1'
	# 7개 이상의 측정값이 연속으로 증가하거나 감소하는 경우 이상 추세가 존재
    if same_side_in_a_row(queue_incdec,6) :
	    violated_rule_flag[4]='1'
    if different_side_in_a_row(queue_outof2sig,2) :
	    violated_rule_flag[5]='1'
    return ''.join(violated_rule_flag)



def AIAG(queue,gauss) : # Ruleset 9 보류
    violated_rule_flag = list('000') # 3 rules
    queue = pd.DataFrame(queue)
    mean = float(gauss['mean'])
    stddev = float(gauss['stddev'])
    queue_dev = queue-mean 			# deviation
    queue_sign = np.sign(queue_dev) # mean 기준 부호
    queue_diff = queue.diff()		   # difference 두 값의 차이
    queue_incdec = np.sign(queue_diff) # is increasing or decreasing? 두 값차이의 부호 = 증감여부
    if (3*stddev < abs(queue_dev.iloc[len(queue)-1])).value :
	    violated_rule_flag[0]='1'
    # 7개 이상의 측정값이 연속으로 평균위거나 아래인경우 지속적인 편향 존재
    if same_side_in_a_row(queue_sign,7) :
	    violated_rule_flag[1]='1'
	# 7개 이상의 측정값이 연속으로 증가하거나 감소하는 경우 이상 추세가 존재
    if same_side_in_a_row(queue_incdec,6) :
	    violated_rule_flag[2]='1'
    return ''.join(violated_rule_flag)



    

def AD_by_spc(sample_queue,gauss,ruleset) :
    violated_rule_flag = ''
    if (ruleset.loc[0,'ruleset_id']==1) :
	    violated_rule_flag = nelson(sample_queue,gauss)
    elif (ruleset.loc[0,'ruleset_id']==2) : 
	    violated_rule_flag = WE(sample_queue,gauss)
    elif (ruleset.loc[0,'ruleset_id']==3) : 
	    violated_rule_flag = WE_supple(sample_queue,gauss)
    elif (ruleset.loc[0,'ruleset_id']==4) : 
	    violated_rule_flag = WE_asymm(sample_queue,gauss)
    elif (ruleset.loc[0,'ruleset_id']==5) : 
	    violated_rule_flag = Juran(sample_queue,gauss)
    elif (ruleset.loc[0,'ruleset_id']==6) : 
	    violated_rule_flag = Gitlow(sample_queue,gauss)
    elif (ruleset.loc[0,'ruleset_id']==7) : 
	    violated_rule_flag = Duncan(sample_queue,gauss)
    elif (ruleset.loc[0,'ruleset_id']==8) : 
	    violated_rule_flag = Westgard(sample_queue,gauss)
    elif (ruleset.loc[0,'ruleset_id']==9) : 
	    violated_rule_flag = AIAG(sample_queue,gauss)
    elif (ruleset.loc[0,'ruleset_id']==0) :
	    violated_rule_flag = basic(sample_queue,gauss)
    return violated_rule_flag  

def data_prerpocessing(Data,gauss,min_sample_cnt) :
    Sample = Data.loc[0:min_sample_cnt, :]
    q75, q50, q25 = np.percentile(Sample['value'], [75 ,50,25])
    #m = q50
    iqr = q75-q25
    #Sample = Sample[((m-iqr < Sample.value) & (Sample.value<m+iqr))]['value']
    Sample = Sample[((q25-1.5*iqr < Sample.value) & (Sample.value<q75+1.5*iqr))]['value']
    mean = np.mean(Sample)
    std  = np.std(Sample)
    print('filtered : mean ', mean, ' std ',std)
    gauss.loc[0,'mean'] = mean
    gauss.loc[0,'stddev'] = std
    return gauss



def spcrule_summ(table,summary,time_col,value_col,min_sample_cnt=50,ruleset_id=1,filtering=0):
	# table = input 테이블
	# summary = 이전 데이터
	# time_col = 시간 컬럼
	# value_col = 이상감지 대상 컬럼
	# min_sample_cnt = 이상감지 전 필요한 최소 샘플 갯수
	
		 
	##################### 시작 ##############################
	min_sample_cnt = int(min_sample_cnt)
	ruleset_id = int(ruleset_id)
	filtering = int(filtering)
	Data = table[[time_col,value_col]]
	summ = summary
	Data.columns = ['time','value']
	  
	Data['standard_mean']= None
	Data['standard_stddev']= None
	Data['result'] = None
	Data['is_violated']=None
	Data['value'] = Data['value'].values.astype(float)

	gauss =pd.DataFrame({'mean':[0.0,], 'stddev':[0.0,], 'examined_sample_counter':[0,]},columns = ['mean', 'stddev','examined_sample_counter'])
	idx=0
	old_data = pd.DataFrame(list(summ.loc[0,'sampled_data']),columns=['value'])
	old_data['result'] = 'old_data'
	print(old_data)
	if not old_data.empty : 
		Data = old_data.append(Data)
		Data = Data.reset_index(drop=True)
		idx=old_data.shape[0]
		gauss['mean'] = summ['mean']
		gauss['stddev'] = summ['stddev']
		gauss['examined_sample_counter'] = summ['examined_sample_counter']
		
	Data = Data[['time','value','standard_mean','standard_stddev','result','is_violated']]
		
	ruleset = setting_ruleset(ruleset_id)
	rules = ruleset.loc[0,'description'].split("\n")
	window_size = ruleset.loc[0,'window_size']
	min_sample_cnt = max(min_sample_cnt, window_size)

	for i in range (idx, Data.shape[0]) : # Data.shape[0]
		new_gauss = new_gaussmodel(gauss,Data.loc[i,'value']) # 현재 값을 반영한 mean, stddev 계산
		if (gauss.loc[0,'examined_sample_counter'] < min_sample_cnt) | (i < window_size) :			 # lack of sample or lower limit
			Data.loc[i,'result'] = 'lack of samples'
			Data.loc[i,'standard_mean']=gauss.loc[0,'mean']
			Data.loc[i,'standard_stddev']=gauss.loc[0,'stddev']
			gauss = new_gauss
		elif gauss.loc[0,'examined_sample_counter'] == min_sample_cnt :
			if filtering==1 : 
				new_gauss = data_prerpocessing(Data,new_gauss,min_sample_cnt)
			gauss = new_gauss
			Data.loc[i,'standard_mean']=gauss.loc[0,'mean']
			Data.loc[i,'standard_stddev']=gauss.loc[0,'stddev']
			Data.loc[i,'result'] = AD_by_spc(Data.loc[i-window_size-1:i,'value'],gauss,ruleset) # str(sum(Data.loc[i-14:i,'value'])) #
			if '1' in Data.loc[i,'result'] : #1-1-1 : 이상이 감지 됨
				Data.loc[i,'is_violated'] = True # 이상
			else :
				Data.loc[i,'is_violated'] = False # 정상
				gauss = new_gauss
		else : 
			Data.loc[i,'standard_mean']=gauss.loc[0,'mean']
			Data.loc[i,'standard_stddev']=gauss.loc[0,'stddev']
			Data.loc[i,'result'] = AD_by_spc(Data.loc[i-window_size-1:i,'value'],gauss,ruleset) # str(sum(Data.loc[i-14:i,'value'])) #
			if '1' in Data.loc[i]['result'] : #1-1-1 : 이상이 감지 됨
				Data.loc[i,'is_violated'] = True
			else :
				Data.loc[i,'is_violated'] = False
				gauss = new_gauss 

	Data['standard_mean'] = Data['standard_mean'].values.astype(float)
	Data['standard_stddev'] = Data['standard_stddev'].values.astype(float)

	summary = gauss[['mean', 'stddev','examined_sample_counter']]
	summary['sampled_data'] = [Data.iloc[-15:]['value'].tolist()] # summary를 위해

	return {'out_table':Data,'out_table2':summary}
