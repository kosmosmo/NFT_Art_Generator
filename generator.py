layers_folder = 'example2\layers'
layers_map_path = 'example2\\'
attribute_map_path = 'example2\\'
total_art = 1000
image_output_path = 'example2\\outputs\\'

from collections import OrderedDict
import os, json, random,cv2
import numpy as np

def create_json():
    layers_map = OrderedDict()
    my_layers = os.listdir(layers_folder)
    for layer in my_layers:
        layers_map[layer] = {}
        pics = os.listdir(layers_folder+ '\\' + layer)
        temp = {'0_no_attributes':{'att_chance':1.0,'black_list_att':[]}}
        for p in pics:
            temp[p.split('.')[0]] = {'att_chance':1.0,'black_list_att':[]}
        layers_map[layer]['link_att'] = None
        layers_map[layer]['attributes'] = temp
        with open(layers_map_path + 'layers_map.json', 'w') as f:
            f.write(json.dumps(layers_map, indent=4, separators=(',', ': '), sort_keys=True))
    return layers_map

def get_weight(attributes):
    population = []
    weight = []
    for key,val in attributes.items():
        population.append(key)
        weight.append(val['att_chance'])
    return [population,weight]

def generate_att():
    with open(layers_map_path + 'layers_map.json', 'r') as f:
        layers_map = json.load(f, object_pairs_hook=OrderedDict)
    attribute_map = OrderedDict()
    visited = set()
    i = 0
    while i < total_art:
        print ('generating number ' + str(i))
        temp = OrderedDict()
        atts = ''
        for key,val in layers_map.items():
            if val['link_att'] == None:
                population, weights = get_weight(val['attributes'])
                random_pick = random.choices(population=population, weights=weights)[0]
                temp[key] = random_pick
            else:
                if temp[val['link_att']] in val['attributes']:
                    temp[key] = temp[val['link_att']]
                else:
                    temp[key] ='0_no_attributes'
            atts += key + ':' +  temp[key]+ ','
        if atts not in visited:
            visited.add(atts)
            attribute_map[i] = temp
            i += 1
    with open(attribute_map_path + 'attributes_map.json', 'w') as f:
        f.write(json.dumps(attribute_map, indent=4, separators=(',', ': '), sort_keys=True))
    return attribute_map

def generate_art():
    with open(attribute_map_path + 'attributes_map.json', 'r') as f:
        attribute_map = json.load(f, object_pairs_hook=OrderedDict)
    for key,val in attribute_map.items():
        print('generating img ' + key)
        img1 =  np.zeros((1, 1,3), dtype=np.uint8)
        for key1,val1 in val.items():
            if val1 == "0_no_attributes":continue
            img_path = 'example2\layers\\' +key1 + '\\' +  val1  + ".png"
            fg = cv2.imread(
                img_path, -1)
            print(img_path)
            fg = cv2.cvtColor(fg, cv2.COLOR_RGB2RGBA)
            fgMask = fg[:, :, 3:]
            img = fg[:, :, :-1]
            bgMask = 255 - fgMask
            imgMask = cv2.cvtColor(fgMask, cv2.COLOR_GRAY2BGR)
            bgMask = cv2.cvtColor(bgMask, cv2.COLOR_GRAY2BGR)
            bgNew = (img1 * (1 / 255.0)) * (bgMask * (1 / 255.0))
            imgNew = (img * (1 / 255.0)) * (imgMask * (1 / 255.0))
            result = np.uint8(cv2.addWeighted(bgNew, 255.0, imgNew, 255.0, 0.0))
            img1 = result
        cv2.imwrite(image_output_path+ key +'.png', img1)
#create_json()
#generate_att()
#generate_art()

