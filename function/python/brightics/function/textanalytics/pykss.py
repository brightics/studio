"""
    Copyright 2019 Samsung SDS
    
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    
        http://www.apache.org/licenses/LICENSE-2.0
    
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
"""

"""
    A KSS(Korean Sentence Splitter) module.

    This is pure Python version of the project kss 1.2.5 
    https://pypi.org/project/kss/.

    We choose to rewrite kss in pure Python because we want the module 
    works in all Python implementations without C++ build.
"""


# -*- coding: utf-8 -*-

DEFAULT = 'DEFAULT'
DA = 'DA'
YO = 'YO'
SB = 'SB'
COMMON = 'COMMON'

NONE = 0
PREV = 1 << 0
CONT = 1 << 1
NEXT = 1 << 2
NEXT1 = 1 << 3
NEXT2 = 1 << 4


mapDA = {'갔': PREV,
         '간': PREV,
         '겠': PREV,
         '겼': PREV,
         '같': PREV,
         '놨': PREV,
         '녔': PREV,
         '니': PREV,
         '낸': PREV,
         '냈': PREV,
         '뒀': PREV,
         '때': PREV,
         '랐': PREV,
         '럽': PREV,
         '렵': PREV,
         '렸': PREV,
         '린': PREV,
         '뤘': PREV,
         '밌': PREV,
         '봤': PREV,
         '섰': PREV,
         '샜': PREV,
         '않': PREV,
         '았': PREV,
         '없': PREV,
         '었': PREV,
         '였': PREV,
         '온': PREV,
         '웠': PREV,
         '이': PREV,
         '인': PREV,
         '있': PREV,
         '졌': PREV,
         '쳤': PREV,
         '챘': PREV,
         '팠': PREV,
         '펐': PREV,
         '했': PREV,
         '혔': PREV,
         '가': NEXT,
         '고': NEXT | NEXT2,
         '는': NEXT | NEXT2,
         '라': NEXT,
         '를': NEXT,
         '만': NEXT,
         '며': NEXT | NEXT2,
         '면': NEXT | NEXT1 | NEXT2,
         '서': PREV | NEXT2,
         '싶': PREV | NEXT,
         '죠': NEXT,
         '죵': NEXT,
         '쥬': NEXT,
         '하': PREV | NEXT1,
         '해': NEXT1,
         '도': NEXT2}

mapYO = {'가': PREV,
         '구': PREV,
         '군': PREV,
         '걸': PREV,
         '까': PREV,
         '께': PREV,
         '껴': PREV,
         '네': PREV,
         '나': PREV,
         '데': PREV,
         '든': PREV,
         '서': PREV,
         '세': PREV,
         '아': PREV,
         '어': PREV,
         '워': PREV,
         '에': PREV,
         '예': PREV,
         '을': PREV,
         '져': PREV,
         '줘': PREV,
         '지': PREV,
         '춰': PREV,
         '해': PREV,
         '고': PREV | NEXT2,
         '는': NEXT,
         '라': NEXT1,
         '를': NEXT,
         '며': NEXT2,
         '면': PREV | NEXT2,
         '하': NEXT1}

mapSB = {'가': PREV,
         '까': PREV,
         '거': PREV,
         '걸': PREV,
         '껄': PREV,
         '나': PREV,
         '니': PREV,
         '다': PREV,
         '도': PREV,
         '든': PREV,
         '랴': PREV,
         '래': PREV,
         '마': PREV,
         '봐': PREV,
         '서': PREV,
         '아': PREV,
         '어': PREV,
         '오': PREV,
         '요': PREV,
         '을': PREV,
         '자': PREV,
         '지': PREV,
         '죠': PREV,
         '고': PREV | NEXT2,
         '는': NEXT,
         '라': PREV | NEXT,
         '며': NEXT2,
         '면': NEXT2,
         '하': NEXT1}

mapCOMMON = {'ㅅ': CONT,
             'ㅎ': CONT,
             'ㅋ': CONT,
             'ㅠ': CONT,
             'ㅜ': CONT,
             '^': CONT,
             ';': CONT,
             '.': CONT,
             '?': CONT,
             '!': CONT,
             ')': CONT,
             '~': CONT,
             '…': CONT,
             ',': CONT}

chmap = {DA: mapDA,
         YO: mapYO,
         SB: mapSB,
         COMMON: mapCOMMON}


class pykss:
    @staticmethod
    def splitSentences(text):
        result = []
        prevChr = ''
        curSentence = ''
        stk = []
        curStat = 'DEFAULT'

        def _push_pop_symbol(symbol):
            if stk:
                if stk[-1] == symbol:
                    del stk[-1]
                else:
                    stk.append(symbol)
            else:
                stk.append(symbol)

        for chrString in text:
            if curStat == 'DEFAULT':
                if chrString == '´':
                    chrString = '\''

                if chrString in {'"', '\''}:
                    _push_pop_symbol(chrString)
                elif chrString in {'‘', '“'}:
                    stk.append(chrString)
                elif chrString in {'’', '”'}:
                    if stk:
                        del stk[-1]
                elif chrString == '다':
                    if not stk and (chmap[DA].get(prevChr, NONE) & PREV):
                        curStat = 'DA'
                elif chrString == '요':
                    if not stk and (chmap[YO].get(prevChr, NONE) & PREV):
                        curStat = 'YO'
                elif chrString in {'!', '?', '.'}:
                    if not stk and (chmap[SB].get(prevChr, NONE) & PREV):
                        curStat = 'SB'
            else:
                curStat_chrS = chmap[curStat].get(chrString, NONE)
                curStatPREVC = chmap[curStat].get(prevChr, NONE)

                if chrString == ' ' or (
                        chmap[COMMON].get(chrString, NONE) & CONT):
                    if curStatPREVC & NEXT1:
                        result.append(curSentence.strip())
                        curSentence = prevChr
                        curStat = DEFAULT
                elif curStat_chrS & NEXT:
                    if curStatPREVC & NEXT1:
                        curSentence += prevChr
                    curStat = DEFAULT
                elif curStat_chrS & NEXT1:
                    if curStatPREVC & NEXT1:
                        result.append(curSentence.strip())
                        curSentence = prevChr
                        curStat = DEFAULT
                elif curStat_chrS & NEXT2:
                    if curStatPREVC & NEXT1:
                        curSentence += prevChr
                    else:
                        result.append(curSentence.strip())
                        curSentence = ''
                    curStat = DEFAULT
                elif curStat_chrS == NONE or (curStat_chrS & PREV):
                    result.append(curSentence.strip())
                    curSentence = ''

                    if curStatPREVC & NEXT1:
                        curSentence += prevChr
                    curStat = DEFAULT

                    if chrString in {'\'', '\"'}:
                        _push_pop_symbol(chrString)
                    elif chrString in {'‘', '“'}:
                        stk.append(chrString)
                    elif chrString in {'’', '”'}:
                        if stk:
                            del stk[-1]
                else:
                    pass

            if curStat == 'DEFAULT' or not (
                    chmap[curStat].get(chrString, NONE) & NEXT1):
                curSentence += chrString
            prevChr = chrString

        if curSentence:
            result.append(curSentence.strip())
            curSentence = ''

        flag = chmap.get(curStat)
        flag = NONE if flag is None else flag.get(prevChr, NONE)

        if flag & NEXT1:
            curSentence += prevChr
            result.append(curSentence.strip())
            curSentence = ''

        return result
