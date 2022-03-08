#filename, label_text, label, image

class InputDataFields(object):
    '''
    
    '''
    filename = 'filename'
    label = 'label'
    image = 'image'
    original_image = 'original_image'
    
    num_label_texts = 'num_label_texts'
    label_texts = 'label_texts'
    
    groundtruth_boxes = 'groundtruth_boxes'
    num_groundtruth_boxes = 'num_groundtruth_boxes'
    groundtruth_classes = 'groundtruth_classes'
    
    key_dict = {
        filename: 'features',
        image: 'features',
        label: 'labels',
        original_image: 'features',
        
        num_label_texts: 'labels',
        label_texts: 'labels',
        
        groundtruth_boxes: 'labels',
        num_groundtruth_boxes: 'labels',
        groundtruth_classes: 'labels'
    }
    
#     image_additional_channels = 'image_additional_channels'
#     original_image = 'original_image'
#     original_image_spatial_shape = 'original_image_spatial_shape'
#     key = 'key'
#     source_id = 'source_id'
#     filename = 'filename'
#     groundtruth_image_classes = 'groundtruth_image_classes'
#     groundtruth_image_confidences = 'groundtruth_image_confidences'
#     groundtruth_boxes = 'groundtruth_boxes'
#     groundtruth_classes = 'groundtruth_classes'
#     groundtruth_confidences = 'groundtruth_confidences'
#     groundtruth_label_types = 'groundtruth_label_types'
#     groundtruth_is_crowd = 'groundtruth_is_crowd'
#     groundtruth_area = 'groundtruth_area'
#     groundtruth_difficult = 'groundtruth_difficult'
#     groundtruth_group_of = 'groundtruth_group_of'
#     proposal_boxes = 'proposal_boxes'
#     proposal_objectness = 'proposal_objectness'
#     groundtruth_instance_masks = 'groundtruth_instance_masks'
#     groundtruth_instance_boundaries = 'groundtruth_instance_boundaries'
#     groundtruth_instance_classes = 'groundtruth_instance_classes'
#     groundtruth_keypoints = 'groundtruth_keypoints'
#     groundtruth_keypoint_visibilities = 'groundtruth_keypoint_visibilities'
#     groundtruth_label_weights = 'groundtruth_label_weights'
#     groundtruth_weights = 'groundtruth_weights'
#     num_groundtruth_boxes = 'num_groundtruth_boxes'
#     is_annotated = 'is_annotated'
#     true_image_shape = 'true_image_shape'
#     multiclass_scores = 'multiclass_scores'
    
class AlbumentationsFields(object):
    image = 'image'
    bboxes = 'bboxes'